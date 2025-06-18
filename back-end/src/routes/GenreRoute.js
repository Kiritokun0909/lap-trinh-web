const express = require('express');
const GenreController = require('../app/controllers/GenreController');
const authMiddleware = require('../middlewares/AuthMiddleware');
const OptionalAuthMiddleware = require('../middlewares/OptionalMiddleware');
const { ROLE_ADMIN } = require('../utils/HandleCode');
const router = express.Router();

router.get('/', OptionalAuthMiddleware, GenreController.getAllGenres);
router.post(
  '/',
  OptionalAuthMiddleware,
  authMiddleware([ROLE_ADMIN]),
  GenreController.addGenre
);
router.put(
  '/:genreId',
  OptionalAuthMiddleware,
  authMiddleware([ROLE_ADMIN]),
  GenreController.updateGenre
);
router.delete(
  '/:genreId',
  OptionalAuthMiddleware,
  authMiddleware([ROLE_ADMIN]),
  GenreController.deleteGenre
);

module.exports = router;
