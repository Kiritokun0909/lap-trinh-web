const express = require('express');
const AuthController = require('../app/controllers/AuthController');
const router = express.Router();

router.post('/login', AuthController.login);
router.post('/reset-passwords', AuthController.resetAllPasswords);
router.post('/register', AuthController.register);
router.post('/refresh-token', AuthController.refreshToken);

module.exports = router;
