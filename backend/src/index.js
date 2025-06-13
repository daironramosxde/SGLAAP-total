require('dotenv').config();
require('colors');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const logger = require('./middleware/logger');

// Importar rutas
const auth = require('./routes/auth');
const users = require('./routes/users');
const restaurants = require('./routes/restaurants');
const employees = require('./routes/employees');
const schedules = require('./routes/schedules');
const events = require('./routes/events');
const reports = require('./routes/reports');

// Conectar a MongoDB
connectDB();

// Inicializar Express
const app = express();

// Middlewares básicos
app.use(express.json());
app.use(cookieParser());
app.use(logger);

// Seguridad
app.use(helmet());
app.use(hpp());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100
});
app.use(limiter);

// Logger en desarrollo
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Montar routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/restaurants', restaurants);
app.use('/api/v1/employees', employees);
app.use('/api/v1/schedules', schedules);
app.use('/api/v1/events', events);
app.use('/api/v1/reports', reports);

// Manejo de errores
app.use(errorHandler);

// Servir frontend en producción
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'));
  });
}

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
});

// Manejar promesas rechazadas
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  server.close(() => process.exit(1));
});