const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add the employee\'s name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add the employee\'s email'],
    unique: true,
    match: [
      /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  position: {
    type: String,
    required: [true, 'Please add the employee\'s position'],
    enum: [    'Mesero',
    'Cocinero',
    'Administrador',
    'Auxiliar de cocina',
    'Cajero',
    'Domiciliario']
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: [true, 'Please specify the restaurant']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
