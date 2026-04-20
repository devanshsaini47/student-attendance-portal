const express = require('express');
const router = express.Router();
const { loginUser, registerUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

router.post('/login', loginUser);
router.post('/register', protect, adminOnly, registerUser);
router.get('/me', protect, getMe);

module.exports = router;
