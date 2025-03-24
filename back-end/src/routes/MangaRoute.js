const express = require("express");
const MangaController = require("../app/controllers/MangaController");
const router = express.Router();

router.get("/", MangaController.getAllMangas);
router.get("/:mangaId", MangaController.getMangaById);
router.get("/:mangaId/chapters", MangaController.getAllChaptersOfManga);

module.exports = router;
