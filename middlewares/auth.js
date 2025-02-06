const {getUser} = require("../services/auth");

function checkForAuthentication(req,res, next){
   
    const tokenCookie = req.cookies?.token;
    req.user = null;
    
   if(!tokenCookie)
    return next();
   
    const token = tokenCookie;
    const user = getUser(token);
    
    req.user = user;
    return next();
}
// now we will create roles like ADMIN, Normal User etc
function restrictTo(roles = []){
    return function(req, res, next){
        if(!req.user ) return res.redirect("/login");
   if(!roles.includes(req.user.role)) return res.end("Unauthorized")
    return next();
    };
}

module.exports = {
    //restricToLoggedinUserOnly,
    //checkAuth,
    checkForAuthentication,
    restrictTo,
}
