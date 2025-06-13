const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// Middleware para proteger rutas
exports.protect = async (req, res, next) => {
  let token;

  // Verificar el token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verificar el token con JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Buscar al usuario
      req.user = await User.findById(decoded.id);

      next();
    } catch (error) {
      return next(new ErrorResponse('No autorizado', 401));
    }
  }

  if (!token) {
    return next(new ErrorResponse('No autorizado', 401));
  }
};

// Middleware para autorizar roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse('No autorizado para acceder a esta ruta', 403));
    }
    next();
  };
};
