const jwt = require("jsonwebtoken");
const secret = "Sam123@wins";
//now we will create tokens for users
function setUser(user){
   
    return jwt.sign(
        {
            _id: user._id,
            email: user.email,
            role: user.role,
        }, secret);
}
function getUser(token){
    if (!token) return null;
    try{
        return jwt.verify(token, secret);
    } catch(error){
        return null;
    }
 
}
module.exports = {
    setUser,
    getUser,
};