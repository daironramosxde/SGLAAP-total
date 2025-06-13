// src/routes/events.js

const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/events');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(protect, authorize('gerente','empleado'), getEvents)
  .post(protect, authorize('gerente'), createEvent);

router
  .route('/:id')
  .get(protect, authorize('gerente','empleado'), getEvent)
  .put(protect, authorize('gerente','empleado'), updateEvent)
  .delete(protect, authorize('gerente'), deleteEvent);

module.exports = router;
