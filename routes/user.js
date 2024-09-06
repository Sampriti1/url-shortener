//here all the user related work will be done like login sign up etc
const express = require("express");


const router = express.Router();
const {handleUserSignup, handleUserLogin} = require("../controllers/user");

//route for sign up
router.post('/',handleUserSignup);
router.post('/login',handleUserLogin)


module.exports = router;