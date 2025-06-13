const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Obtener todos los usuarios
// @route   GET /api/v1/users
// @access  Privado (Admin)
exports.getUsers = asyncHandler(async (req, res, next) => {
  let query;

  // Admin puede ver todos los usuarios
  if (req.user.role === 'admin') {
    query = User.find();
  } else {
    // Otros roles (gerente, etc.) solo ven sus propios datos
    query = User.find({ _id: req.user.id });
  }

  const users = await query;

  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});

// @desc    Obtener un usuario
// @route   GET /api/v1/users/:id
// @access  Privado (Admin/Gerente)
exports.getUser = asyncHandler(async (req, res, next) => {
  let user;

  if (req.user.role === 'admin') {
    user = await User.findById(req.params.id);
  } else {
    user = await User.findOne({
      _id: req.params.id,
      _id: req.user.id // Solo puede ver su propio perfil
    });
  }

  if (!user) {
    return next(
      new ErrorResponse(`Usuario no encontrado con id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: user });
});

// @desc    Actualizar usuario
// @route   PUT /api/v1/users/:id
// @access  Privado (Admin/Gerente)
exports.updateUser = asyncHandler(async (req, res, next) => {
  let user;

  if (req.user.role === 'admin') {
    user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
  } else {
    user = await User.findOneAndUpdate(
      { _id: req.params.id, _id: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
  }

  if (!user) {
    return next(
      new ErrorResponse(`Usuario no encontrado con id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: user });
});

// @desc    Eliminar usuario
// @route   DELETE /api/v1/users/:id
// @access  Privado (Admin/Gerente)
exports.deleteUser = asyncHandler(async (req, res, next) => {
  let user;

  if (req.user.role === 'admin') {
    user = await User.findByIdAndDelete(req.params.id);
  } else {
    user = await User.findOneAndDelete({
      _id: req.params.id,
      _id: req.user.id
    });
  }

  if (!user) {
    return next(
      new ErrorResponse(`Usuario no encontrado con id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: {} });
});
