// src/validators/restaurantValidators.js

const { body, param, validationResult } = require('express-validator');
const Restaurant = require('../models/Restaurant');

// Validador para crear un restaurante
exports.createRestaurantValidator = [
  body('name')
    .notEmpty()
    .withMessage('El nombre del restaurante es obligatorio')
    .isLength({ max: 50 })
    .withMessage('El nombre del restaurante no puede exceder los 50 caracteres'),
  body('address')
    .notEmpty()
    .withMessage('La dirección del restaurante es obligatoria')
    .isLength({ max: 100 })
    .withMessage('La dirección del restaurante no puede exceder los 100 caracteres'),
  body('phone')
    .notEmpty()
    .withMessage('El número de teléfono es obligatorio')
    .isLength({ max: 20 })
    .withMessage('El número de teléfono no puede exceder los 20 caracteres'),
  body('email')
    .isEmail()
    .withMessage('Debe ser un correo electrónico válido')
    .optional({ checkFalsy: true }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];

// Validador para actualizar un restaurante
exports.updateRestaurantValidator = [
  param('id').isMongoId().withMessage('El id del restaurante no es válido'),
  body('name')
    .optional()
    .isLength({ max: 50 })
    .withMessage('El nombre del restaurante no puede exceder los 50 caracteres'),
  body('address')
    .optional()
    .isLength({ max: 100 })
    .withMessage('La dirección del restaurante no puede exceder los 100 caracteres'),
  body('phone')
    .optional()
    .isLength({ max: 20 })
    .withMessage('El número de teléfono no puede exceder los 20 caracteres'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Debe ser un correo electrónico válido'),
  body('type')
    .optional()
    .isLength({ max: 30 })
    .withMessage('El tipo de restaurante no puede exceder los 30 caracteres'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];
