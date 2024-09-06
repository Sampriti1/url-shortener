//router of url
const express = require("express")
const {handleGenerateNewShortURL, handleGetAnalytics} = require('../controllers/url')

const router = express.Router();
router.post("/", handleGenerateNewShortURL) //it means /URL , express will take care of that, here "/" is like a prefix to "/URL"
//get route for analytics i.e., kitne baje kitne clicks hue the on the url uska info
router.get("/analytics/:shortId", handleGetAnalytics )
module.exports = router;