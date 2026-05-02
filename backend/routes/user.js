const express = require("express");
const router = express.Router();
const { handleUserSignup, handleUserLogin } = require("../controllers/user");


router.post('/', handleUserSignup);
router.post('/login', handleUserLogin);

router.get('/me', (req, res) => {
    if (req.user) {
        
        return res.json({ 
            user: {
                
                name: req.user.name,
                email: req.user.email,
                role: req.user.role,
            }
        });
    }
   
    return res.status(401).json({ error: 'User is not authenticated' });
});

module.exports = router;