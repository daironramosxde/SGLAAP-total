const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: [true, 'Please specify the restaurant']
  },
  type: {
    type: String,
    required: [true, 'Please specify the report type'],
    enum: ['sales', 'performance', 'feedback']
  },
  data: {
    type: mongoose.Schema.Types.Mixed, // Puede ser un objeto de cualquier tipo de datos
    required: [true, 'Please add the report data']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
