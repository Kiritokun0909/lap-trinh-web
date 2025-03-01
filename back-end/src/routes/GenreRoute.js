const express = require('express');
const GenreController = require('../app/controllers/GenreController');
const authMiddleware = require('../middlewares/AuthMiddleware');
const { ROLE_ADMIN } = require('../utils/HandleCode');
const router = express.Router();

router.get('/', GenreController.getAllGenres);
router.post('/', authMiddleware([ROLE_ADMIN]), GenreController.addGenre);
router.put('/:genreId', GenreController.updateGenre);
router.delete('/:genreId', GenreController.deleteGenre);

module.exports = router;
