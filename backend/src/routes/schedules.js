// src/routes/schedules.js

const express = require('express');
const router = express.Router();
const {
  getSchedules,
  getSchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule
} = require('../controllers/schedules');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(protect, authorize('gerente','empleado'), getSchedules)
  .post(protect, authorize('gerente'), createSchedule);

router
  .route('/:id')
  .get(protect, authorize('gerente','empleado'), getSchedule)
  .put(protect, authorize('gerente','empleado'), updateSchedule)
  .delete(protect, authorize('gerente'), deleteSchedule);

module.exports = router;
