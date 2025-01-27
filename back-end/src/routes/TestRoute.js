const express = require('express');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const { ROLE_USER, ROLE_ADMIN } = require('../utils/HandleCode');
const router = express.Router();

router.post('/both', AuthMiddleware([ROLE_USER, ROLE_ADMIN]), (req, res) => {
  res.send('OK!');
});

router.post('/user', AuthMiddleware([ROLE_USER]), (req, res) => {
  res.send('OK!');
});

router.post('/admin', AuthMiddleware([ROLE_ADMIN]), (req, res) => {
  res.send('OK!');
});

module.exports = router;
