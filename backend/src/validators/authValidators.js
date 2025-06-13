const { check } = require('express-validator');
const User = require('../models/User');

exports.registerValidator = [
  check('name', 'El nombre es requerido')
    .not().isEmpty()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres'),

  check('email', 'Por favor ingrese un email válido')
    .isEmail()
    .normalizeEmail()
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        throw new Error('El email ya está registrado');
      }
    }),

  check('password', 'La contraseña debe tener al menos 6 caracteres')
    .isLength({ min: 6 }),

  check('role', 'El rol es requerido')
    .isIn(['employee', 'manager', 'admin'])
    .withMessage('Rol no válido'),

  check('restaurant', 'El restaurante es requerido')
    .not().isEmpty()
    .isMongoId()
    .withMessage('ID de restaurante no válido')
];

exports.loginValidator = [
  check('email', 'Por favor ingrese un email válido')
    .isEmail()
    .normalizeEmail(),

  check('password', 'La contraseña es requerida')
    .not().isEmpty()
];

exports.updateDetailsValidator = [
  check('name')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres'),

  check('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Email no válido')
];

exports.updatePasswordValidator = [
  check('currentPassword', 'La contraseña actual es requerida')
    .not().isEmpty(),

  check('newPassword', 'La nueva contraseña debe tener al menos 6 caracteres')
    .isLength({ min: 6 })
];
