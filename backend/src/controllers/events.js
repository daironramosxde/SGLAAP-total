// src/controllers/events.js

const Event = require('../models/Event');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');

// Obtener todos los eventos
exports.getEvents = asyncHandler(async (req, res, next) => {
  const events = await Event.find();

  res.status(200).json({
    success: true,
    count: events.length,
    data: events
  });
});

// Obtener un evento por ID
exports.getEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(new ErrorResponse(`Evento no encontrado con id ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: event
  });
});

// Crear un nuevo evento
exports.createEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.create(req.body);

  res.status(201).json({
    success: true,
    data: event
  });
});

// Actualizar un evento
exports.updateEvent = asyncHandler(async (req, res, next) => {
  let event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!event) {
    return next(new ErrorResponse(`Evento no encontrado con id ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: event
  });
});

// Eliminar un evento
exports.deleteEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findByIdAndDelete(req.params.id);

  if (!event) {
    return next(new ErrorResponse(`Evento no encontrado con id ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: {}
  });
});
