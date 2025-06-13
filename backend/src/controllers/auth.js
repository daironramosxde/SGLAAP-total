const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const jwt = require('jsonwebtoken');

// @desc    Registrar usuario
// @route   POST /api/v1/auth/register
// @access  Público
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role, restaurant } = req.body;

  // Validar que el email no exista
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorResponse('El email ya está registrado', 400));
  }

  // Crear usuario
  const user = await User.create({
    name,
    email,
    password,
    role,
    restaurant
  });

  sendTokenResponse(user, 201, res);
});

// @desc    Iniciar sesión
// @route   POST /api/v1/auth/login
// @access  Público
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validar email y contraseña
  if (!email || !password) {
    return next(new ErrorResponse('Por favor ingrese email y contraseña', 400));
  }

  // Buscar usuario
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new ErrorResponse('Credenciales inválidas', 401));
  }

  // Verificar contraseña
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse('Credenciales inválidas', 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Obtener usuario actual
// @route   GET /api/v1/auth/me
// @access  Privado
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate('restaurant');
  res.status(200).json({ success: true, data: user });
});

// @desc    Actualizar detalles de usuario
// @route   PUT /api/v1/auth/updatedetails
// @access  Privado
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: user });
});

// @desc    Actualizar contraseña
// @route   PUT /api/v1/auth/updatepassword
// @access  Privado
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  // Verificar contraseña actual
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('La contraseña actual es incorrecta', 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// ✅ Helper actualizado para enviar token con role y email
const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE
    }
  );

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, token });
};
