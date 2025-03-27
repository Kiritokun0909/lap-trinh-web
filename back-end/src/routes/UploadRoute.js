const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const router = express.Router();

const UploadFileController = require('../app/controllers/UploadFileController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const { ROLE_ADMIN } = require('../utils/HandleCode');

router.post(
  '/image',
  AuthMiddleware([ROLE_ADMIN]),
  upload.single('image'),
  UploadFileController.uploadFileToCloud
);

module.exports = router;
