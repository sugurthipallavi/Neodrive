/**
 * Car models served from project root /cars.
 * Files are expected to be accessible at: http://localhost:4000/cars/<file>.glb
 */
export const POLY_CARS = {
  // Hero: Futuristic electric sports car
  x: {
    glb: 'http://localhost:4000/cars/aston_martins_future_car_model_pk_version_free.glb',
    name: 'NeoDrive X',
    page: 'https://sketchfab.com/3d-models/futuristic-electric-sports-car-concept-design-cad5ec62361141068a067a49e6c0e12b',
    scale: 0.55,
    position: [0, -1.02, 0],
    rotation: [0, Math.PI / 2, 0],
  },

  // Showroom: Futuristic supercar
  s: {
    glb: 'http://localhost:4000/cars/lamborghini_centenario.glb',
    name: 'NeoDrive S',
    page: 'https://sketchfab.com/3d-models/futuristic-supercar-concept-854a503a4bc146ada7d649ef121bcde3',
    scale: 0.55,
    position: [0, -1.04, 0],
    rotation: [0, Math.PI / 2, 0],
  },

  // Customization: Retro-futuristic car
  z: {
    glb: 'http://localhost:4000/cars/mclaren_mp4-12c_ultimate.glb',
    name: 'NeoDrive Z',
    page: 'https://sketchfab.com/3d-models/retro-futuristic-car-0b9a8e5101ab49ef88caa8d257c620f3',
    scale: 0.55,
    position: [0, -1.04, 0],
    rotation: [0, Math.PI / 2, 0],
  },
}

/** Home hero — Tesla Model 3 GLB in `/cars` (served by API static `/cars`) */
export const HERO_CAR = {
  glb: 'http://localhost:4000/cars/tesla_m3_model.glb',
  name: 'Tesla Model 3',
  scale: 0.42,
  position: [0, -0.14, 0],
  rotation: [0, Math.PI / 2, 0],
}

/** Preload list — dedupe URLs */
export const POLY_CAR_URLS = [...new Set([HERO_CAR.glb, ...Object.values(POLY_CARS).map((c) => c.glb)])]

/** If a poster exists for a GLB, this will point to it. Otherwise it's fine (backgroundImage will just be missing). */
export function polyPreviewImage(glbUrl) {
  return glbUrl.replace(/\.glb$/i, '.jpg')
}


