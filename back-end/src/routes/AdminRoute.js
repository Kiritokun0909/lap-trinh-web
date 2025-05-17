const express = require('express');

const router = express.Router();

const AuthMiddleware = require('../middlewares/AuthMiddleware');
const { ROLE_ADMIN } = require('../utils/HandleCode');

const AdminController = require('../app/controllers/AdminController');

router.get('/users', AuthMiddleware([ROLE_ADMIN]), AdminController.getUsers);
router.put(
  '/block-user/:userId',
  AuthMiddleware([ROLE_ADMIN]),
  AdminController.blockUser
);

module.exports = router;
