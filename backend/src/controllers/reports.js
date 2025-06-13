// src/controllers/reports.js

const Report = require('../models/Report');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');

// Obtener todos los reportes
exports.getReports = asyncHandler(async (req, res, next) => {
  const reports = await Report.find();

  res.status(200).json({
    success: true,
    count: reports.length,
    data: reports
  });
});

// Obtener un reporte por ID
exports.getReport = asyncHandler(async (req, res, next) => {
  const report = await Report.findById(req.params.id);

  if (!report) {
    return next(new ErrorResponse(`Reporte no encontrado con id ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: report
  });
});

// Crear un nuevo reporte
exports.createReport = asyncHandler(async (req, res, next) => {
  const report = await Report.create(req.body);

  res.status(201).json({
    success: true,
    data: report
  });
});

// Actualizar un reporte
exports.updateReport = asyncHandler(async (req, res, next) => {
  let report = await Report.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!report) {
    return next(new ErrorResponse(`Reporte no encontrado con id ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: report
  });
});

// Eliminar un reporte
exports.deleteReport = asyncHandler(async (req, res, next) => {
  const report = await Report.findByIdAndDelete(req.params.id);

  if (!report) {
    return next(new ErrorResponse(`Reporte no encontrado con id ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: {}
  });
});
