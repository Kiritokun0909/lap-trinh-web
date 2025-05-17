const express = require('express');
const ChapterController = require('../app/controllers/ChapterController');
const router = express.Router();

router.get('/:chapterId/images', ChapterController.getChapterImages);

router.post('/:mangaId', ChapterController.addChapter);
router.put('/:chapterId', ChapterController.updateChapter);
router.delete('/:chapterId', ChapterController.deleteChapter);

module.exports = router;
