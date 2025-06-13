// src/controllers/employees.js

const Employee = require('../models/Employee');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');

// Obtener todos los empleados
exports.getEmployees = asyncHandler(async (req, res, next) => {
  const employees = await Employee.find();

  res.status(200).json({
    success: true,
    count: employees.length,
    data: employees
  });
});

// Obtener un empleado por ID
exports.getEmployee = asyncHandler(async (req, res, next) => {
  const employee = await Employee.findById(req.params.id);

  if (!employee) {
    return next(new ErrorResponse(`Empleado no encontrado con id ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: employee
  });
});

// Crear un nuevo empleado
exports.createEmployee = asyncHandler(async (req, res, next) => {
  const employee = await Employee.create(req.body);

  res.status(201).json({
    success: true,
    data: employee
  });
});

// Actualizar un empleado
exports.updateEmployee = asyncHandler(async (req, res, next) => {
  let employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!employee) {
    return next(new ErrorResponse(`Empleado no encontrado con id ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: employee
  });
});

// Eliminar un empleado
exports.deleteEmployee = asyncHandler(async (req, res, next) => {
  const employee = await Employee.findByIdAndDelete(req.params.id);

  if (!employee) {
    return next(new ErrorResponse(`Empleado no encontrado con id ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: {}
  });
});
