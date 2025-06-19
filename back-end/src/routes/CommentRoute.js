const express = require('express');
const CommentController = require('../app/controllers/CommentController');
const router = express.Router();
const authMiddleware = require('../middlewares/AuthMiddleware');
const OptionalAuthMiddleware = require('../middlewares/OptionalMiddleware');
const { ROLE_ADMIN, ROLE_USER, GUEST } = require('../utils/HandleCode');

//router.post('/', CommentController.addChapterComment);
router.get(
  '/chapters/:chapterId',
  OptionalAuthMiddleware,
  authMiddleware([ROLE_ADMIN, ROLE_USER, GUEST]),
  CommentController.getChapterCommentsWithReplies
);
router.post(
  '/chapters/',
  OptionalAuthMiddleware,
  authMiddleware([ROLE_ADMIN, ROLE_USER]),
  CommentController.addChapterComment
);
router.put(
  '/chapters',
  OptionalAuthMiddleware,
  authMiddleware([ROLE_ADMIN, ROLE_USER]),
  CommentController.updateChapterComment
);
router.delete(
  '/chapters/:commentId',
  OptionalAuthMiddleware,
  authMiddleware([ROLE_ADMIN, ROLE_USER]),
  CommentController.deleteChapterComment
);

router.get(
  '/mangas/:mangaId',
  OptionalAuthMiddleware,
  authMiddleware([ROLE_ADMIN, ROLE_USER, GUEST]),
  CommentController.getMangaCommentsWithReplies
);
router.post(
  '/mangas/',
  OptionalAuthMiddleware,
  authMiddleware([ROLE_ADMIN, ROLE_USER]),
  CommentController.addMangaComment
);
router.put(
  '/mangas',
  OptionalAuthMiddleware,
  authMiddleware([ROLE_ADMIN, ROLE_USER]),
  CommentController.updateMangaComment
);
router.delete(
  '/mangas/:commentId',
  OptionalAuthMiddleware,
  authMiddleware([ROLE_ADMIN, ROLE_USER]),
  CommentController.deleteMangaComment
);

module.exports = router;
