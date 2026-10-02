require('dotenv').config();
const express = require('express');
const cors = require('cors');
// Ensure DB file + seed runs on startup
const { _dbReady: dbReady } = require('./db');

// Start server only after DB is initialized (sql.js init is async).
let server;
(async () => {
  const db = await dbReady;

  const authRoutes = require('./routes/auth');
  const bookingRoutes = require('./routes/bookings');
  const vehicleRoutes = require('./routes/vehicles');
  const contactRoutes = require('./routes/contacts');
  const adminRoutes = require('./routes/admin');

  const app = express();

  // Hot-swap the DB instance into route modules that do `require('../db')`.
  // Ensures `db.prepare` exists and prevents `db.prepare is not a function`.
  require.cache[require.resolve('./db')].exports = db;

  const PORT = process.env.PORT || 4000;
  const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

  app.use(
    cors({
      origin: CLIENT_ORIGIN,
      credentials: true,
    })
  );
  app.use(express.json());

  app.get('/api/health', (req, res) => {
    res.json({ ok: true, service: 'NeoDrive API' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/vehicles', vehicleRoutes);
  app.use('/api/contacts', contactRoutes);
  app.use('/api/admin', adminRoutes);

  // Serve local GLB files from /cars
  const carsMiddleware = require('./carsMiddleware')
  carsMiddleware(app)

  app.use((err, req, res, next) => {

    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  })

  server = app.listen(PORT, () => {

    console.log(`NeoDrive API listening on http://localhost:${PORT}`);
    console.log(`CORS origin: ${CLIENT_ORIGIN}`);
  });
})();



