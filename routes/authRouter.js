const router = require('express').Router();

const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/activate', authController.activate);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password', authController.resetPassword);

module.exports = router;
