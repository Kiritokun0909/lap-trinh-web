const express = require('express');
const multer = require('multer');
const router = express.Router();
const upload = multer({ dest: 'uploads/' });

const AuthMiddleware = require('../middlewares/AuthMiddleware');
const { ROLE_USER, ROLE_ADMIN } = require('../utils/HandleCode');
const UserController = require('../app/controllers/UserController');
const UploadFileController = require('../app/controllers/UploadFileController');

router.post(
  '/upload',
  AuthMiddleware([ROLE_USER, ROLE_ADMIN]),
  upload.single('avatar'),
  UploadFileController.uploadFileToCloud
);

router.get('/', AuthMiddleware([ROLE_USER, ROLE_ADMIN]), UserController.getUserInfo);

router.put(
  '/update-email',
  AuthMiddleware([ROLE_USER, ROLE_ADMIN]),
  UserController.changeUserEmail
);
router.put(
  '/update-password',
  AuthMiddleware([ROLE_USER, ROLE_ADMIN]),
  UserController.changeUserPassword
);
router.put(
  '/update-account',
  AuthMiddleware([ROLE_USER, ROLE_ADMIN]),
  UserController.updateUserInfo
);

router.get('/check-like/:mangaId', AuthMiddleware([ROLE_USER]), UserController.checkUserLikeManga);
router.get(
  '/check-follow/:mangaId',
  AuthMiddleware([ROLE_USER]),
  UserController.checkUserFollowManga
);

router.post('/like/:mangaId', AuthMiddleware([ROLE_USER]), UserController.likeManga);
router.delete('/unlike/:mangaId', AuthMiddleware([ROLE_USER]), UserController.unlikeManga);
router.post('/follow/:mangaId', AuthMiddleware([ROLE_USER]), UserController.followManga);
router.delete('/unfollow/:mangaId', AuthMiddleware([ROLE_USER]), UserController.unfollowManga);

router.get('/list-like', AuthMiddleware([ROLE_USER]), UserController.getListLikeManga);
router.get('/list-follow', AuthMiddleware([ROLE_USER]), UserController.getListFollowManga);

module.exports = router;
