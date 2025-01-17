const siteRouter = require('./siteRoute.js');

const authRouter = require('./AuthRoute.js');

const mangaRouter = require('./MangaRoute.js');

function route(app) {
  app.use('/', siteRouter);

  app.use('/auth', authRouter);

  app.use('/mangas', mangaRouter);
}

module.exports = route;
