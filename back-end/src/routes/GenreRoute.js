const express = require('express');
const GenreController = require('../app/controllers/GenreController');
const router = express.Router();

router.get('/', GenreController.getAllGenres);

module.exports = router;
