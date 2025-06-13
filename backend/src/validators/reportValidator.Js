const { check, body } = require('express-validator');
const Restaurant = require('../models/Restaurant');

exports.reportValidator = [
  check('title', 'El título es requerido')
    .not().isEmpty()
    .trim()
    .isLength({ max: 100 }),
    
  check('type', 'El tipo de reporte es requerido')
    .isIn([
      'attendance', 'sales', 'inventory', 
      'performance', 'incident', 'financial'
    ]),
    
  check('restaurant', 'El restaurante es requerido')
    .not().isEmpty()
    .isMongoId()
    .custom(async (restaurantId, { req }) => {
      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) {
        throw new Error('Restaurante no encontrado');
      }
      if (req.user.role !== 'admin' && restaurant._id.toString() !== req.user.restaurant.toString()) {
        throw new Error('No autorizado para generar reportes de este restaurante');
      }
    }),
    
  check('period.start', 'Fecha de inicio del período es requerida')
    .not().isEmpty()
    .isISO8601()
    .toDate(),
    
  check('period.end', 'Fecha de fin del período es requerida')
    .not().isEmpty()
    .isISO8601()
    .toDate()
    .custom((end, { req }) => {
      return new Date(end) > new Date(req.body.period.start);
    })
    .withMessage('La fecha de fin debe ser posterior a la fecha de inicio'),
    
  check('status', 'Estado no válido')
    .optional()
    .isIn(['pending', 'generated', 'reviewed', 'archived'])
];