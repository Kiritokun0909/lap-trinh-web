// src/app/controllers/SiteController.js
const siteService = require("../services/SiteService.js");

class SiteController {
  async welcome(req, res) {
    res.json({ message: "Welcome to my api." });
  }

  async testApi(req, res) {
    res.json({ message: "API is working." });
  }
}

module.exports = new SiteController();