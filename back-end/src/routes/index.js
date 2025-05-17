const siteRouter = require('./siteRoute.js');

const testRouter = require('./TestRoute.js');

const authRouter = require('./AuthRoute.js');
const userRouter = require('./UserRoute.js');

const mangaRouter = require('./MangaRoute.js');
const chapterRouter = require('./ChapterRoute.js');
const genreRouter = require('./GenreRoute.js');

<<<<<<< HEAD
const uploadRouter = require('./UploadRoute');
const authorRoute = require('./AuthorRoute');

const adminRouter = require('./AdminRoute');
=======
const commentRouter = require('./CommentRoute.js');
>>>>>>> origin/back-end

function route(app) {
  app.use('/', siteRouter);

  app.use('/test', testRouter);

  app.use('/auth', authRouter);
  app.use('/user', userRouter);

  app.use('/mangas', mangaRouter);
  app.use('/chapters', chapterRouter);
  app.use('/genres', genreRouter);

<<<<<<< HEAD
  app.use('/upload', uploadRouter);
  app.use('/authors', authorRoute);

  app.use('/admin', adminRouter);
=======
  app.use('/comments', commentRouter);
>>>>>>> origin/back-end
}

module.exports = route;
