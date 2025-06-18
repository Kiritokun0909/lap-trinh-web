const siteRouter = require('./siteRoute.js');

const testRouter = require('./TestRoute.js');

const authRouter = require('./AuthRoute.js');
const userRouter = require('./UserRoute.js');

const mangaRouter = require('./MangaRoute.js');
const chapterRouter = require('./ChapterRoute.js');
const genreRouter = require('./GenreRoute.js');
const authorRouter = require('./AuthorRoute.js');

const commentRouter = require('./CommentRoute.js');
const adminRouter = require('./AdminRoute.js');

const uploadRouter = require('./UploadRoute.js');
const statisticRouter = require('./StatisticRoute.js');

function route(app) {
  app.use('/', siteRouter);

  app.use('/test', testRouter);

  app.use('/auth', authRouter);
  app.use('/user', userRouter);

  app.use('/mangas', mangaRouter);
  app.use('/chapters', chapterRouter);
  app.use('/genres', genreRouter);
  app.use('/authors', authorRouter);

  app.use('/comments', commentRouter);
  app.use('/admin', adminRouter);

  app.use('/upload', uploadRouter);
  app.use('/statistic', statisticRouter);
}

module.exports = route;
