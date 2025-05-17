const express = require('express');
const CommentController = require('../app/controllers/CommentController');
const router = express.Router();
const authMiddleware = require('../middlewares/AuthMiddleware');
const { ROLE_ADMIN, ROLE_USER, GUEST } = require('../utils/HandleCode');

//router.post('/', CommentController.addChapterComment);
router.get(
  '/chapters/:chapterId',
  authMiddleware([ROLE_ADMIN, ROLE_USER, GUEST]),
  CommentController.getChapterCommentsWithReplies
);
router.post('/chapters/', authMiddleware([ROLE_ADMIN, ROLE_USER]), CommentController.addChapterComment);
router.put('/chapters', authMiddleware([ROLE_ADMIN, ROLE_USER]), CommentController.updateChapterComment);
router.delete('/chapters/:commentId', authMiddleware([ROLE_ADMIN, ROLE_USER]), CommentController.deleteChapterComment);

router.get(
  '/mangas/:mangaId',
  authMiddleware([ROLE_ADMIN, ROLE_USER, GUEST]),
  CommentController.getMangaCommentsWithReplies
);
router.post('/mangas/', authMiddleware([ROLE_ADMIN, ROLE_USER]), CommentController.addMangaComment);
router.put('/mangas', authMiddleware([ROLE_ADMIN, ROLE_USER]), CommentController.updateMangaComment);
router.delete('/mangas/:commentId', authMiddleware([ROLE_ADMIN, ROLE_USER]), CommentController.deleteMangaComment);

module.exports = router;
