const { check, body } = require('express-validator');
const Restaurant = require('../models/Restaurant');

exports.eventValidator = [
  check('title', 'El título es requerido')
    .not().isEmpty()
    .trim()
    .isLength({ max: 100 }),
    
  check('description', 'La descripción es requerida')
    .not().isEmpty()
    .isLength({ max: 500 }),
    
  check('restaurant', 'El restaurante es requerido')
    .not().isEmpty()
    .isMongoId()
    .custom(async (restaurantId, { req }) => {
      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) {
        throw new Error('Restaurante no encontrado');
      }
      if (req.user.role !== 'admin' && restaurant._id.toString() !== req.user.restaurant.toString()) {
        throw new Error('No autorizado para crear eventos en este restaurante');
      }
    }),
    
  check('start', 'La fecha de inicio es requerida')
    .not().isEmpty()
    .isISO8601()
    .toDate(),
    
  check('end', 'La fecha de fin es requerida')
    .not().isEmpty()
    .isISO8601()
    .toDate()
    .custom((end, { req }) => {
      return new Date(end) > new Date(req.body.start);
    })
    .withMessage('La fecha de fin debe ser posterior a la fecha de inicio'),
    
  check('employeesRequired', 'Los empleados requeridos deben ser un array')
    .optional()
    .isArray(),
    
  body('employeesRequired.*.position', 'Puesto requerido no válido')
    .optional()
    .isString(),
    
  body('employeesRequired.*.quantity', 'Cantidad requerida no válida')
    .optional()
    .isInt({ min: 1 }),
    
  check('status', 'Estado no válido')
    .optional()
    .isIn(['planned', 'confirmed', 'in_progress', 'completed', 'cancelled'])
];