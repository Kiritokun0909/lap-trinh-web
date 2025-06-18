const express = require('express');

const multer = require('multer');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

const AuthMiddleware = require('../middlewares/AuthMiddleware');
const OptionalAuthMiddleware = require('../middlewares/OptionalMiddleware');
const { ROLE_USER, ROLE_ADMIN } = require('../utils/HandleCode');
const UserController = require('../app/controllers/UserController');
const UploadFileController = require('../app/controllers/UploadFileController');

router.post(
  '/upload',
  OptionalAuthMiddleware,
  AuthMiddleware([ROLE_USER, ROLE_ADMIN]),
  upload.single('avatar'),
  UploadFileController.uploadFileToCloud
);

router.get(
  '/',
  OptionalAuthMiddleware,
  AuthMiddleware([ROLE_USER, ROLE_ADMIN]),
  UserController.getUserInfo
);

router.put(
  '/update-email',
  OptionalAuthMiddleware,
  AuthMiddleware([ROLE_USER, ROLE_ADMIN]),
  UserController.changeUserEmail
);
router.put(
  '/update-password',
  OptionalAuthMiddleware,
  AuthMiddleware([ROLE_USER, ROLE_ADMIN]),
  UserController.changeUserPassword
);
router.put(
  '/update-account',
  OptionalAuthMiddleware,
  AuthMiddleware([ROLE_USER, ROLE_ADMIN]),
  UserController.updateUserInfo
);

router.get(
  '/check-like/:mangaId',
  OptionalAuthMiddleware,
  AuthMiddleware([ROLE_USER]),
  UserController.checkUserLikeManga
);
router.get(
  '/check-follow/:mangaId',
  OptionalAuthMiddleware,
  AuthMiddleware([ROLE_USER]),
  UserController.checkUserFollowManga
);

router.get(
  '/check-like/:mangaId',
  OptionalAuthMiddleware,
  AuthMiddleware([ROLE_USER]),
  UserController.checkUserLikeManga
);

router.get(
  '/check-follow/:mangaId',
  OptionalAuthMiddleware,
  AuthMiddleware([ROLE_USER]),
  UserController.checkUserFollowManga
);

router.post(
  '/like/:mangaId',
  OptionalAuthMiddleware,
  AuthMiddleware([ROLE_USER]),
  UserController.likeManga
);
router.delete(
  '/unlike/:mangaId',
  OptionalAuthMiddleware,
  AuthMiddleware([ROLE_USER]),
  UserController.unlikeManga
);
router.post(
  '/follow/:mangaId',
  OptionalAuthMiddleware,
  AuthMiddleware([ROLE_USER]),
  UserController.followManga
);
router.delete(
  '/unfollow/:mangaId',
  OptionalAuthMiddleware,
  AuthMiddleware([ROLE_USER]),
  UserController.unfollowManga
);

router.get(
  '/list-like',
  OptionalAuthMiddleware,
  AuthMiddleware([ROLE_USER]),
  UserController.getListLikeManga
);
router.get(
  '/list-follow',
  OptionalAuthMiddleware,
  AuthMiddleware([ROLE_USER]),
  UserController.getListFollowManga
);

router.get(
  '/',
  OptionalAuthMiddleware,
  AuthMiddleware([ROLE_ADMIN]),
  UserController.getUsers
);
router.post(
  '/toggle-block/:userId',
  OptionalAuthMiddleware,
  AuthMiddleware([ROLE_ADMIN]),
  UserController.toggleBlockUser
);

router.get(
  '/notification',
  OptionalAuthMiddleware,
  AuthMiddleware([ROLE_USER]),
  UserController.getNotification
);
router.put(
  '/read-notification/:notificationId',
  OptionalAuthMiddleware,
  AuthMiddleware([ROLE_USER]),
  UserController.readNotification
);

router.get(
  '/history',
  OptionalAuthMiddleware,
  AuthMiddleware([ROLE_USER]),
  UserController.getUserHistory
);

module.exports = router;
