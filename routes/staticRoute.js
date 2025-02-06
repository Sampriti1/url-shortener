const express= require("express");
const URL = require("../model/url")
const{checkForAuthentication, restrictTo} = require("../middlewares/auth");
const router = express.Router();
router.get("/admin/urls", restrictTo(['ADMIN']), async(req,res) =>{
    //if(!req.user) return res.redirect("/login") 
        const allurl = await URL.find({});
        return res.render("home", {
            urls: allurl,
        })
})
router.get("/", restrictTo(["NORMAL", "ADMIN"]), async (req,res) =>{
   // if(!req.user) return res.redirect("/login") 
    const allurl = await URL.find({createdBy: req.user._id});
    return res.render("home", {
        urls: allurl,
    })
})
router.get("/signup", (req, res) =>{
    return res.render("signup");
})
router.get("/login", (req,res) =>{
    return res.render("login");
})
module.exports = router;