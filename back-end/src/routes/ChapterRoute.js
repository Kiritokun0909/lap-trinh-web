const express = require('express');
const ChapterController = require('../app/controllers/ChapterController');
const router = express.Router();

router.get('/:chapterId/chapter-images', ChapterController.getAllChaptersImagesOfChapter);

module.exports = router;
