const {v4: uuidv4} = require('uuid')

const User = require('../model/user');
const {setUser} = require("../services/auth");
async function handleUserSignup(req,res) {
    const {name, email, password} = req.body;
    await User.create({
  name,
  email,
  password,
    });
    return res.redirect("/")
}
async function handleUserLogin(req,res) {
  const {email, password} = req.body;
 const user = await User.findOne({email, password});
 console.log("User", user)
 if(!user) return res.render('login',{
  error: "Invalid Username or password",
 });
 
  const token = setUser(user);
  res.cookie("token", token)
  return res.render("home");


}
  
  

module.exports = {
    handleUserSignup,
    handleUserLogin,
}