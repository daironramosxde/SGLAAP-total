const express = require('express');
const {
  register,
  login,
  getMe,
  updateDetails,
  updatePassword
} = require('../controllers/auth');
const { protect } = require('../middleware/auth');
const {
  registerValidator,
  loginValidator,
  updateDetailsValidator,
  updatePasswordValidator
} = require('../validators/authValidators');

const router = express.Router();

// Public routes
router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);

// Protected routes
router.use(protect);

router.get('/me', getMe);
router.put('/updatedetails', updateDetailsValidator, updateDetails);
router.put('/updatepassword', updatePasswordValidator, updatePassword);

module.exports = router;