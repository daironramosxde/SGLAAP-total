// src/routes/restaurants.js

const express = require('express');
const router = express.Router();
const {
  getRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant
} = require('../controllers/restaurants');
const { createRestaurantValidator, updateRestaurantValidator } = require('../validators/restaurantValidators');
const { protect, authorize } = require('../middleware/auth');

// Rutas para restaurantes
router
  .route('/')
  .get(protect, authorize('gerente','empleado'), getRestaurants) // Obtener todos los restaurantes
  .post(protect, authorize('gerente'), createRestaurantValidator, createRestaurant); // Crear un nuevo restaurante

router
  .route('/:id')
  .get(protect, authorize('gerente','empleado'), getRestaurant) // Obtener restaurante por id
  .put(protect, authorize('gerente'), updateRestaurantValidator, updateRestaurant) // Actualizar restaurante
  .delete(protect, authorize('gerente'), deleteRestaurant); // Eliminar restaurante

module.exports = router;
