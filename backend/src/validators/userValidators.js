const { check } = require('express-validator');
const User = require('../models/User');

exports.userUpdateValidator = [
  check('name', 'El nombre es requerido')
    .not().isEmpty()
    .trim()
    .isLength({ min: 2, max: 50 }),

  check('email', 'Por favor ingrese un email válido')
    .isEmail()
    .normalizeEmail()
    .custom(async (email, { req }) => {
      const user = await User.findOne({ email });
      if (user && user._id.toString() !== req.params.id) {
        throw new Error('El email ya está registrado');
      }
    }),

  check('role', 'El rol es requerido')
    .isIn(['employee', 'manager', 'admin'])
    .withMessage('Rol no válido'),

  check('restaurant', 'El restaurante es requerido')
    .optional()
    .isMongoId()
    .withMessage('ID de restaurante no válido'),

  check('status', 'Estado no válido')
    .optional()
    .isIn(['active', 'inactive', 'on_leave'])
];
