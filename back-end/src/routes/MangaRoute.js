const express = require('express');
const MangaController = require('../app/controllers/MangaController');
const authMiddleware = require('../middlewares/AuthMiddleware');
const router = express.Router();

router.get('/', MangaController.getAllMangas);
// router.get('/', authMiddleware, MangaController.getAllMangas);

module.exports = router;
