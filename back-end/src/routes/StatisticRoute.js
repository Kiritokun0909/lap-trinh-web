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
  '/total-users',
  OptionalAuthMiddleware,
  StatisticController.getTotalUserNumber
);
router.get(
  '/total-mangas',
  OptionalAuthMiddleware,
  StatisticController.getTotalMangaNumber
);
// router.get('/:mangaId', OptionalAuthMiddleware, MangaController.getMangaById);
// router.get('/:mangaId/chapters', MangaController.getAllChaptersOfManga);

// router.post('/', AuthMiddleware([ROLE_ADMIN]), MangaController.addManga);
// router.put('/:mangaId', AuthMiddleware([ROLE_ADMIN]), MangaController.updateManga);
// router.delete('/:mangaId', AuthMiddleware([ROLE_ADMIN]), MangaController.deleteManga);

// router.put(
//   '/hide/:mangaId',
//   AuthMiddleware([ROLE_ADMIN]),
//   MangaController.updateMangaHideStatus
// );

module.exports = router;
