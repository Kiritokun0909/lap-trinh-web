const siteRouter = require('./siteRoute.js');
const mangaRouter = require('./MangaRoute.js');
function route(app) {
  app.use('/', siteRouter);

  app.use('/mangas', mangaRouter);
}

module.exports = route;
