const siteRouter = require("./siteRoute.js");

function route(app) {

  app.use("/", siteRouter);
}

module.exports = route;