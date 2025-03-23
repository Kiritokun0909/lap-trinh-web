const express = require('express');
const ChapterController = require('../app/controllers/ChapterController');
const router = express.Router();

router.get('/:chapterId/images', ChapterController.getChapterImages);

module.exports = router;
