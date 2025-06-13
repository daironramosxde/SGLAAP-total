// src/controllers/schedules.js

const Schedule = require('../models/Schedule');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');

// Obtener todos los horarios
exports.getSchedules = asyncHandler(async (req, res, next) => {
  const schedules = await Schedule.find();

  res.status(200).json({
    success: true,
    count: schedules.length,
    data: schedules
  });
});

// Obtener un horario por ID
exports.getSchedule = asyncHandler(async (req, res, next) => {
  const schedule = await Schedule.findById(req.params.id);

  if (!schedule) {
    return next(new ErrorResponse(`Horario no encontrado con id ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: schedule
  });
});

// Crear un nuevo horario
exports.createSchedule = asyncHandler(async (req, res, next) => {
  const schedule = await Schedule.create(req.body);

  res.status(201).json({
    success: true,
    data: schedule
  });
});

// Actualizar un horario
exports.updateSchedule = asyncHandler(async (req, res, next) => {
  let schedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!schedule) {
    return next(new ErrorResponse(`Horario no encontrado con id ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: schedule
  });
});

// Eliminar un horario
exports.deleteSchedule = asyncHandler(async (req, res, next) => {
  const schedule = await Schedule.findByIdAndDelete(req.params.id);

  if (!schedule) {
    return next(new ErrorResponse(`Horario no encontrado con id ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: {}
  });
});
