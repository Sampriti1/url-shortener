const express= require("express");
const URL = require("../model/url");

const router = express.Router();


router.get("/admin/urls", async (req, res) => {
    
    const allurl = await URL.find({});
 
    return res.json({ urls: allurl });
});


router.get("/", async (req, res) => {
    if (!req.user) {
    
        return res.status(401).json({ error: "User not authenticated" });
    }
    const allurl = await URL.find({ createdBy: req.user._id });

    return res.json({ urls: allurl });
});



module.exports = router;