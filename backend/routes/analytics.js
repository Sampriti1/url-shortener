const express = require("express");
const router = express.Router();
const { handleGetUserAnalytics } = require('../controllers/analytics');


router.get("/", handleGetUserAnalytics);

module.exports = router;