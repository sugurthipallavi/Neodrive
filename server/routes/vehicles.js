const express = require('express');
let db;

// Always fetch latest initialized db instance.
function getDb() {
  if (db) return db
  db = require('../db')
  return db
}

const router = express.Router();


router.get('/', (req, res) => {
  const db = getDb();
  const rows = (db.prepare ? db.prepare('SELECT * FROM vehicles ORDER BY price DESC').all() : db.exec('SELECT * FROM vehicles ORDER BY price DESC'));
  res.json(rows);
});


router.get('/:slug', (req, res) => {
  const db = getDb();
  const row = db.prepare('SELECT * FROM vehicles WHERE slug = ?').get(req.params.slug);
  if (!row) return res.status(404).json({ error: 'Vehicle not found' });
  res.json(row);
});



module.exports = router;
