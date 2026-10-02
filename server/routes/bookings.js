const express = require('express');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { authOptional, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/',
  authOptional,
  [
    body('vehicle_model').trim().notEmpty(),
    body('name').trim().notEmpty(),
    body('email').isEmail().normalizeEmail(),
    body('phone').trim().notEmpty(),
    body('date').notEmpty(),
    body('time').notEmpty(),
    body('location').trim().notEmpty(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const id = uuidv4();
    const user_id = req.user?.id || null;
    const { vehicle_model, name, email, phone, date, time, location } = req.body;

    db.prepare(
      `INSERT INTO bookings (id, user_id, vehicle_model, name, email, phone, date, time, location)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(id, user_id, vehicle_model, name, email, phone, date, time, location);

    res.status(201).json({
      id,
      message: 'Test drive booked successfully',
    });
  }
);

router.get('/', requireAdmin, (req, res) => {
  const rows = db
    .prepare(
      `SELECT b.*, u.name AS user_name FROM bookings b
       LEFT JOIN users u ON b.user_id = u.id
       ORDER BY b.created_at DESC`
    )
    .all();
  res.json(rows);
});

module.exports = router;
