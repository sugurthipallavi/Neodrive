const path = require('path');
const bcrypt = require('bcryptjs');

// Pure-JS SQLite (WASM). Avoids native better-sqlite3 bindings.
const initSqlJs = require('sql.js');

const dbPath = path.join(__dirname, 'neodrive.db');

async function createDbIfNeeded() {
  const SQL = await initSqlJs({
    // Keep deterministic + small; sql.js will load wasm.
    locateFile: (file) => {
      // sql.js package places wasm under /dist
      return path.join(__dirname, 'node_modules', 'sql.js', 'dist', file);
    },
  });

  let db;
  const fs = require('fs');
  if (fs.existsSync(dbPath) && fs.statSync(dbPath).size > 0) {
    const fileBuffer = fs.readFileSync(dbPath);
    const u8 = new Uint8Array(fileBuffer);
    db = new SQL.Database(u8);
  } else {
    db = new SQL.Database();
  }

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS vehicles (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      price INTEGER NOT NULL,
      top_speed TEXT,
      range TEXT,
      horsepower TEXT,
      torque TEXT,
      image_url TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      vehicle_model TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      location TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      admin_response TEXT,
      responded_at TEXT
    );
  `);

  try {
    db.run('ALTER TABLE contacts ADD COLUMN admin_response TEXT');
  } catch (_) {
    /* column already present */
  }
  try {
    db.run('ALTER TABLE contacts ADD COLUMN responded_at TEXT');
  } catch (_) {
    /* column already present */
  }

// Seed vehicles + admin only if DB is empty.
  // IMPORTANT: bookings/users must NOT be erased when server restarts.

  // Use COUNT(*) as numeric guard.
  const vehiclesCountRes = db.exec('SELECT COUNT(*) AS c FROM vehicles');
  const vehiclesCount = vehiclesCountRes?.[0]?.values?.[0]?.[0] ?? 0;

  const usersCountRes = db.exec('SELECT COUNT(*) AS c FROM users');
  const usersCount = usersCountRes?.[0]?.values?.[0]?.[0] ?? 0;

  // If bookings exist, DB is not empty — never reseed.
  const bookingsCountRes = db.exec('SELECT COUNT(*) AS c FROM bookings');
  const bookingsCount = bookingsCountRes?.[0]?.values?.[0]?.[0] ?? 0;

  if (vehiclesCount === 0 && usersCount === 0 && bookingsCount === 0) {
    const { v4: uuidv4 } = require('uuid');


    const vehicles = [
      {
        slug: 'neodrive-x',
        name: 'NeoDrive X',
        price: 89900,
        top_speed: '210 mph',
        range: '520 mi',
        horsepower: '780 hp',
        torque: '920 lb-ft',
        // Poly Pizza: use the same GLB CDN poster convention (.glb -> .jpg)
        image_url: 'https://static.poly.pizza/bd53628e-9ef8-4809-a8e1-8aa680186d0f.jpg',
      },
      {
        slug: 'neodrive-s',
        name: 'NeoDrive S',
        price: 72900,
        top_speed: '198 mph',
        range: '480 mi',
        horsepower: '620 hp',
        torque: '780 lb-ft',
        image_url: 'https://static.poly.pizza/570c324d-029d-4cb1-b6fe-48a66a39d147.jpg',
      },
      {
        slug: 'neodrive-z',
        name: 'NeoDrive Z',
        price: 62900,
        top_speed: '185 mph',
        range: '440 mi',
        horsepower: '540 hp',
        torque: '680 lb-ft',
        image_url: 'https://static.poly.pizza/7dc33135-12c6-4de4-b5f9-cf445fd35994.jpg',
      },
    ];

    for (const v of vehicles) {
      db.run(
        `INSERT INTO vehicles (id, slug, name, price, top_speed, range, horsepower, torque, image_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)` ,
        [uuidv4(), v.slug, v.name, v.price, v.top_speed, v.range, v.horsepower, v.torque, v.image_url]
      );
    }

    const adminEmail = 'admin@neodrive.io';
    const adminExistsRes = db.exec('SELECT id FROM users WHERE email = ' + JSON.stringify(adminEmail));
    const adminExists = adminExistsRes?.[0]?.values?.length > 0;

    if (!adminExists) {
      const hash = bcrypt.hashSync('admin123', 10);
      db.run(
        `INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)` ,
        [uuidv4(), 'Neo Admin', adminEmail, hash, 'admin']
      );
    }
  }


  const persist = () => {
    fs.writeFileSync(dbPath, Buffer.from(db.export()));
  };

  // Initial persist so file exists and matches schema after migrations/seed.
  persist();

  // Provide a better-sqlite3-like minimal wrapper used by routes.
  // NOTE: sql.js is synchronous once initialized.
  return {
    exec: (sql) => db.exec(sql),
    prepare: (sql) => {
      return {
        get: (...params) => {
          const stmt = db.prepare(sql);
          stmt.bind(params);
          const row = stmt.step() ? stmt.getAsObject() : null;
          stmt.free();
          return row;
        },
        all: (...params) => {
          const stmt = db.prepare(sql);
          stmt.bind(params);
          const rows = [];
          while (stmt.step()) rows.push(stmt.getAsObject());
          stmt.free();
          return rows;
        },
        run: (...params) => {
          const stmt = db.prepare(sql);
          stmt.bind(params);
          stmt.step();
          stmt.free();
          // sql.js is in-memory unless exported; routes use run() for INSERT/UPDATE/DELETE.
          persist();
        },
      };
    },
    transaction: (fn) => {
      // Best effort: wrap in BEGIN/COMMIT. Rollback is not exposed; routes don't rely on it.
      db.run('BEGIN');
      try {
        fn();
        db.run('COMMIT');
      } catch (e) {
        db.run('ROLLBACK');
        throw e;
      } finally {
        persist();
      }
    },
    save: persist,
  };
}

const dbReady = createDbIfNeeded();

// Export both a promise for startup and a mutable holder for routes.
// Routes require('../db') synchronously, so they must see an object
// with `prepare/get/all/run` even before the DB is initialized.
const db = {
  prepare() {
    throw new Error('DB not initialized yet');
  },
  exec() {
    throw new Error('DB not initialized yet');
  },
  run() {
    throw new Error('DB not initialized yet');
  },
  transaction() {
    throw new Error('DB not initialized yet');
  },
  save() {
    throw new Error('DB not initialized yet');
  },
};

dbReady.then((real) => {
  Object.assign(db, real);
  // also keep reference stable
  return db;
});

module.exports = db;
module.exports._dbReady = dbReady;


