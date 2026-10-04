const path = require('path')

/**
 * Serves static GLB models from project root /cars.
 * Usage: app.use('/cars', carsMiddleware())
 */
module.exports = function carsMiddleware(app) {
  const carsDir = path.join(__dirname, 'cars')
  const staticMiddleware = require('express').static
  app.use('/cars', staticMiddleware(carsDir))
}


