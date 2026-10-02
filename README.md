# NeoDrive (3D Vehicle Showcase)

A React + Three.js (react-three-fiber) application with an Express + SQLite backend. The app serves a neon cyberpunk 3D experience (Hero / Showroom / Customization), user auth, bookings, and vehicle data.

> Client and server are in separate folders: `client/` and `server/`.

---

## Features

- **Cyberpunk 3D scenes** using Three.js + R3F
- **GLB model loading** from the server `/cars` directory
- **Authentication** (JWT) with protected admin/user routes
- **Vehicles API** (list + detail by slug)
- **Bookings** and **contacts** endpoints

---

## Project Structure

- `client/` — React (Vite) frontend
- `server/` — Express backend (SQLite via sql.js)
- `cars/` — GLB files served statically by the API

---

## Prerequisites

- Node.js (LTS recommended)

---

## Setup

### 1) Server

```bash
cd server
npm install
npm run dev
```

Default server port: **4000**

The server also serves local GLB files at:

- `http://localhost:4000/cars/<file>.glb`

---

### 2) Client

In a separate terminal:

```bash
cd client
npm install
npm run dev
```

Default client dev port: **5173**

---

## Environment variables

The server uses environment variables via `dotenv`. Create a `.env` file in `server/`.

At minimum you may need:

- `JWT_SECRET` — used to sign auth tokens
- `CLIENT_ORIGIN` — defaults to `http://localhost:5173`
- `PORT` — defaults to `4000`

Example:

```env
JWT_SECRET=replace_me_with_a_long_random_string
CLIENT_ORIGIN=http://localhost:5173
PORT=4000
```

---

## API

All API endpoints are mounted under `/api`.

### Health

- `GET /api/health`

### Vehicles

- `GET /api/vehicles` — list vehicles ordered by price desc
- `GET /api/vehicles/:slug` — vehicle detail

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

JWT is sent by the client via the `Authorization: Bearer <token>` header.

---

## Adding / Updating Car Models

1. Add GLB files into the top-level `cars/` folder.
2. Update the model URLs and transforms in:

- `client/src/config/carAssets.js`

This config controls which GLB models are used for:
- **Hero** (`HERO_CAR`)
- **Showroom** and **Customization** (`POLY_CARS`)

---

## Notes on 3D Rendering

The client includes a `SafeCanvas` component to prevent common render failures (black screen risk) when GLB assets fail or take longer to load.

---

## Development / Build

### Client

```bash
cd client
npm run lint
npm run build
```

### Server

```bash
cd server
npm start
```

---

## TODO

See `TODO.md` in the repo root for current integration tasks (model list updates, tuning car transforms, and visual polish).

