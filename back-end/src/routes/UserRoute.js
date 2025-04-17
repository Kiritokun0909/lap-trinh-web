const express = require('express');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const { ROLE_USER, ROLE_ADMIN } = require('../utils/HandleCode');
const UserController = require('../app/controllers/UserController');
const router = express.Router();

router.get('/check-like/:mangaId', AuthMiddleware([ROLE_USER]), UserController.checkUserLikeManga);

router.get('/check-follow/:mangaId', AuthMiddleware([ROLE_USER]), UserController.checkUserFollowManga);

router.post('/like/:mangaId', AuthMiddleware([ROLE_USER]), UserController.likeManga);
router.delete('/unlike/:mangaId', AuthMiddleware([ROLE_USER]), UserController.unlikeManga);
router.post('/follow/:mangaId', AuthMiddleware([ROLE_USER]), UserController.followManga);
router.delete('/unfollow/:mangaId', AuthMiddleware([ROLE_USER]), UserController.unfollowManga);

router.get('/list-like', AuthMiddleware([ROLE_USER]), UserController.getListLikeManga);
router.get('/list-follow', AuthMiddleware([ROLE_USER]), UserController.getListFollowManga);

router.get('/', AuthMiddleware([ROLE_ADMIN]), UserController.getUsers);
router.post('/toggle-block/:userId', AuthMiddleware([ROLE_ADMIN]), UserController.toggleBlockUser);
module.exports = router;
