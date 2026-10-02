const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(requireAdmin);

const handleValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  return null;
};

router.get('/users', (req, res) => {
  const rows = db
    .prepare(
      `SELECT id, name, email, role, created_at FROM users ORDER BY datetime(created_at) DESC`
    )
    .all();
  res.json(rows);
});

router.get('/stats', (req, res) => {
  const users = db.prepare('SELECT COUNT(*) AS c FROM users').get().c;
  const bookings = db.prepare('SELECT COUNT(*) AS c FROM bookings').get().c;
  const contacts = db.prepare('SELECT COUNT(*) AS c FROM contacts').get().c;
  const vehicles = db.prepare('SELECT COUNT(*) AS c FROM vehicles').get().c;

  const recentBookings = db
    .prepare(
      `SELECT id, vehicle_model, name, email, date, created_at FROM bookings
       ORDER BY datetime(created_at) DESC LIMIT 8`
    )
    .all();

  res.json({ users, bookings, contacts, vehicles, recentBookings });
});

router.get('/analytics/bookings-by-month', (req, res) => {
  const rows = db
    .prepare(
      `SELECT strftime('%Y-%m', created_at) AS month, COUNT(*) AS count
       FROM bookings GROUP BY month ORDER BY month DESC LIMIT 12`
    )
    .all();
  res.json(rows.reverse());
});

router.post(
  '/vehicles',
  [
    body('slug').trim().notEmpty().matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    body('name').trim().notEmpty(),
    body('price').isInt({ min: 0 }),
    body('top_speed').optional().trim(),
    body('range').optional().trim(),
    body('horsepower').optional().trim(),
    body('torque').optional().trim(),
    body('image_url').optional().trim(),
  ],
  (req, res) => {
    if (handleValidation(req, res)) return;
    const { slug, name, price, top_speed, range, horsepower, torque, image_url } = req.body;
    const dup = db.prepare('SELECT id FROM vehicles WHERE slug = ?').get(slug);
    if (dup) return res.status(409).json({ error: 'Slug already exists' });
    const id = uuidv4();
    db.prepare(
      `INSERT INTO vehicles (id, slug, name, price, top_speed, range, horsepower, torque, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(id, slug, name, price, top_speed || null, range || null, horsepower || null, torque || null, image_url || null);
    res.status(201).json({ id, slug, name, message: 'Vehicle created' });
  }
);

router.put(
  '/vehicles/:id',
  [
    param('id').trim().notEmpty(),
    body('slug').trim().notEmpty().matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    body('name').trim().notEmpty(),
    body('price').isInt({ min: 0 }),
    body('top_speed').optional().trim(),
    body('range').optional().trim(),
    body('horsepower').optional().trim(),
    body('torque').optional().trim(),
    body('image_url').optional().trim(),
  ],
  (req, res) => {
    if (handleValidation(req, res)) return;
    const { id } = req.params;
    const row = db.prepare('SELECT id FROM vehicles WHERE id = ?').get(id);
    if (!row) return res.status(404).json({ error: 'Vehicle not found' });
    const { slug, name, price, top_speed, range, horsepower, torque, image_url } = req.body;
    const dup = db.prepare('SELECT id FROM vehicles WHERE slug = ? AND id != ?').get(slug, id);
    if (dup) return res.status(409).json({ error: 'Slug already in use' });
    db.prepare(
      `UPDATE vehicles SET slug = ?, name = ?, price = ?, top_speed = ?, range = ?, horsepower = ?, torque = ?, image_url = ?
       WHERE id = ?`
    ).run(slug, name, price, top_speed || null, range || null, horsepower || null, torque || null, image_url || null, id);
    res.json({ id, message: 'Vehicle updated' });
  }
);

router.delete('/vehicles/:id', param('id').trim().notEmpty(), (req, res) => {
  if (handleValidation(req, res)) return;
  const { id } = req.params;
  const row = db.prepare('SELECT id FROM vehicles WHERE id = ?').get(id);
  if (!row) return res.status(404).json({ error: 'Vehicle not found' });
  const count = db.prepare('SELECT COUNT(*) AS c FROM vehicles').get().c;
  if (count <= 1) return res.status(400).json({ error: 'Cannot delete the last vehicle' });
  db.prepare('DELETE FROM vehicles WHERE id = ?').run(id);
  res.json({ message: 'Vehicle deleted' });
});

/** Save or update admin reply to a contact form message (does not change visitor name/email/body). */
router.post(
  '/contacts/:id/respond',
  [
    param('id').trim().notEmpty(),
    body('response').trim().isLength({ min: 5, max: 8000 }),
  ],
  (req, res) => {
    if (handleValidation(req, res)) return;
    const { id } = req.params;
    const row = db.prepare('SELECT id FROM contacts WHERE id = ?').get(id);
    if (!row) return res.status(404).json({ error: 'Message not found' });
    const { response } = req.body;
    db.prepare(
      `UPDATE contacts SET admin_response = ?, responded_at = datetime('now') WHERE id = ?`
    ).run(response, id);
    res.json({ id, admin_response: response, message: 'Response saved' });
  }
);

module.exports = router;
