// src/validators/scheduleValidator.js

const { body, validationResult } = require('express-validator');

exports.createScheduleValidator = [
  body('day').notEmpty().withMessage('El día es obligatorio'),
  body('startTime').notEmpty().withMessage('La hora de inicio es obligatoria'),
  body('endTime').notEmpty().withMessage('La hora de fin es obligatoria')
];

exports.updateScheduleValidator = [
  body('day').optional().notEmpty().withMessage('El día es obligatorio'),
  body('startTime').optional().notEmpty().withMessage('La hora de inicio es obligatoria'),
  body('endTime').optional().notEmpty().withMessage('La hora de fin es obligatoria')
];

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
