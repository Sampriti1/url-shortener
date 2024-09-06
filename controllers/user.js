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
 })
 //if everything of the user is correct then it will generate a session id
  const sessionId = uuidv4();
  setUser(sessionId, user);
  res.cookie("uid", sessionId) //here we created cookies and name of the cookie is uid and we will send this cookie as response to the user to give him the uid
  return res.render("home"); // "/" means the home route i.e., the home page
  }
  
  

module.exports = {
    handleUserSignup,
    handleUserLogin,
}