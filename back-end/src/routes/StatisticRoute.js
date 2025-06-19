const express = require('express');
const StatisticController = require('../app/controllers/StatisticController');
const OptionalAuthMiddleware = require('../middlewares/OptionalMiddleware');
const { ROLE_ADMIN } = require('../utils/HandleCode');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const router = express.Router();

router.get(
  '/top-mangas',
  OptionalAuthMiddleware,
  AuthMiddleware([ROLE_ADMIN]),
  StatisticController.getTopMangas
);
router.get(
  '/top-genres',
  OptionalAuthMiddleware,
  AuthMiddleware([ROLE_ADMIN]),
  StatisticController.getTopGenres
);
router.get(
  '/total-users',
  OptionalAuthMiddleware,
  StatisticController.getTotalUserNumber
);
router.get(
  '/total-mangas',
  OptionalAuthMiddleware,
  StatisticController.getTotalMangaNumber
);

module.exports = router;
