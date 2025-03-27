const express = require('express');
const router = express.Router();

const AuthorController = require('../app/controllers/AuthorController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const { ROLE_ADMIN } = require('../utils/HandleCode');

router.get('/', AuthMiddleware([ROLE_ADMIN]), AuthorController.getAuthors);
router.post('/', AuthMiddleware([ROLE_ADMIN]), AuthorController.addAuthor);
router.put('/:authorId', AuthMiddleware([ROLE_ADMIN]), AuthorController.updateAuthor);
router.delete('/:authorId', AuthMiddleware([ROLE_ADMIN]), AuthorController.removeAuthor);

module.exports = router;
