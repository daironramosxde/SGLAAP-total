// src/routes/reports.js

const express = require('express');
const router = express.Router();
const {
  getReports,
  getReport,
  createReport,
  updateReport,
  deleteReport
} = require('../controllers/reports');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(protect, authorize('gerente'), getReports)
  .post(protect, authorize('gerente'), createReport);

router
  .route('/:id')
  .get(protect, authorize('gerente'), getReport)
  .put(protect, authorize('gerente'), updateReport)
  .delete(protect, authorize('gerente'), deleteReport);

module.exports = router;
