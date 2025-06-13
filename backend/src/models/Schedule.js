const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: [true, 'Please specify the employee']
  },
  day: {
    type: String,
    required: [true, 'Please add the day of the week'],
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  startTime: {
    type: String,
    required: [true, 'Please add the start time']
  },
  endTime: {
    type: String,
    required: [true, 'Please add the end time']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;
