const siteRouter = require('./siteRoute.js');

const testRouter = require('./TestRoute.js');

const authRouter = require('./AuthRoute.js');
const userRouter = require('./UserRoute.js');

const mangaRouter = require('./MangaRoute.js');
const chapterRouter = require('./ChapterRoute.js');
const genreRouter = require('./GenreRoute.js');

function route(app) {
  app.use('/', siteRouter);

  app.use('/test', testRouter);

  app.use('/auth', authRouter);
  app.use('/user', userRouter);

  app.use('/mangas', mangaRouter);
  app.use('/chapters', chapterRouter);
  app.use('/genres', genreRouter);
}

module.exports = route;
