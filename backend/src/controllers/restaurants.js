// src/controllers/restaurants.js

const Restaurant = require('../models/Restaurant');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Obtener todos los restaurantes
// @route   GET /api/v1/restaurants
// @access  Privado (Admin)
exports.getRestaurants = asyncHandler(async (req, res, next) => {
  const restaurants = await Restaurant.find();
  
  res.status(200).json({
    success: true,
    count: restaurants.length,
    data: restaurants
  });
});

// @desc    Obtener un restaurante por ID
// @route   GET /api/v1/restaurants/:id
// @access  Privado (Admin)
exports.getRestaurant = asyncHandler(async (req, res, next) => {
  const restaurant = await Restaurant.findById(req.params.id);
  
  if (!restaurant) {
    return next(
      new ErrorResponse(`Restaurante no encontrado con id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: restaurant
  });
});

// @desc    Crear un restaurante
// @route   POST /api/v1/restaurants
// @access  Privado (Admin)
exports.createRestaurant = asyncHandler(async (req, res, next) => {
  const restaurant = await Restaurant.create(req.body);
  
  res.status(201).json({
    success: true,
    data: restaurant
  });
});

// @desc    Actualizar un restaurante
// @route   PUT /api/v1/restaurants/:id
// @access  Privado (Admin)
exports.updateRestaurant = asyncHandler(async (req, res, next) => {
  let restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!restaurant) {
    return next(
      new ErrorResponse(`Restaurante no encontrado con id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: restaurant
  });
});

// @desc    Eliminar un restaurante
// @route   DELETE /api/v1/restaurants/:id
// @access  Privado (Admin)
exports.deleteRestaurant = asyncHandler(async (req, res, next) => {
  const restaurant = await Restaurant.findByIdAndDelete(req.params.id);

  if (!restaurant) {
    return next(
      new ErrorResponse(`Restaurante no encontrado con id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: {}
  });
});
