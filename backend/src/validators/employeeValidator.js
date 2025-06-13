// src/validators/employeeValidator.js

const { body, validationResult } = require('express-validator');

exports.createEmployeeValidator = [
  body('name').notEmpty().withMessage('El nombre es obligatorio'),
  body('position').notEmpty().withMessage('El puesto es obligatorio'),
  body('salary').isNumeric().withMessage('El salario debe ser numérico')
];

exports.updateEmployeeValidator = [
  body('name').optional().notEmpty().withMessage('El nombre es obligatorio'),
  body('position').optional().notEmpty().withMessage('El puesto es obligatorio'),
  body('salary').optional().isNumeric().withMessage('El salario debe ser numérico')
];

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
