// src/routes/employees.js

const express = require('express');
const router = express.Router();
const {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employees');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(protect, authorize('gerente','empleado'), getEmployees)
  .post(protect, authorize('gerente'), createEmployee);

router
  .route('/:id')
  .get(protect, authorize('gerente','empleado'), getEmployee)
  .put(protect, authorize('gerente','empleado'), updateEmployee)
  .delete(protect, authorize('gerente'), deleteEmployee);

module.exports = router;
