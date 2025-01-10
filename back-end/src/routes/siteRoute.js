const express = require("express");
const siteController = require("../app/controllers/SiteController.js");
const router = express.Router();

router.get("/", siteController.welcome);

router.get("/test-api", siteController.testApi);

module.exports = router;