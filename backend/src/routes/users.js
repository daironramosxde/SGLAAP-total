const express = require('express');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser
} = require('../controllers/users');
const { protect, authorize } = require('../middleware/auth');
const {
  userUpdateValidator
} = require('../validators/userValidators');

const router = express.Router();

// Todas las rutas protegidas por JWT
router.use(protect);

// Solo admin puede acceder a todas las rutas de usuarios
router.use(authorize('gerente'));

router.route('/')
  .get(getUsers);

router.route('/:id')
  .get(getUser)
  .put(userUpdateValidator, updateUser)  // Aquí se aplica la validación
  .delete(deleteUser);

module.exports = router;
