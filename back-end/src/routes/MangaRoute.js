const express = require('express');
const MangaController = require('../app/controllers/MangaController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const OptionalAuthMiddleware = require('../middlewares/OptionalMiddleware');
const { ROLE_ADMIN } = require('../utils/HandleCode');
const router = express.Router();

router.get('/', OptionalAuthMiddleware, MangaController.getAllMangas);
router.get('/:mangaId', OptionalAuthMiddleware, MangaController.getMangaById);
router.get('/:mangaId/chapters', MangaController.getAllChaptersOfManga);

router.post('/', AuthMiddleware([ROLE_ADMIN]), MangaController.addManga);
router.put('/:mangaId', AuthMiddleware([ROLE_ADMIN]), MangaController.updateManga);
router.delete('/:mangaId', AuthMiddleware([ROLE_ADMIN]), MangaController.deleteManga);

router.put(
  '/hide/:mangaId',
  AuthMiddleware([ROLE_ADMIN]),
  MangaController.updateMangaHideStatus
);

module.exports = router;
