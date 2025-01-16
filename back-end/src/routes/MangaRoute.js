const express = require('express');
const MangaController = require('../app/controllers/MangaController');

const router = express.Router();

router.get('/', MangaController.getAllMangas);

module.exports = router;
