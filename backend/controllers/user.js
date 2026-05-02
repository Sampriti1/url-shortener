const {v4: uuidv4} = require('uuid')

const User = require('../model/user');
const {setUser} = require("../services/auth");

async function handleUserSignup(req, res) {
    const { name, email, password } = req.body;
    await User.create({
        name,
        email,
        password,
    });
  
    return res.status(201).json({ msg: "Signup successful" });
}

async function handleUserLogin(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });

    if (!user) {
      
        return res.status(401).json({ error: "Invalid username or password" });
    }
    
    const token = setUser(user);
    res.cookie("token", token, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', 
    });

    
    return res.json({
        msg: "Login successful",
        user: {
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
}

  
  

module.exports = {
    handleUserSignup,
    handleUserLogin,
}