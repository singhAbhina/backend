const express = require('express');

const authRouter = express.Router();
const { register, login, logout, adminRegister, deleteProfile } = require('../controllers/userAuthent')
const userMiddleware = require("../middleware/userMiddleware");
const adminMiddleware = require('../middleware/adminMiddleware');

// Register
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', userMiddleware, logout);
authRouter.post('/admin/register', adminMiddleware, adminRegister);
authRouter.delete('/deleteProfile', userMiddleware, deleteProfile);

// Check authentication status (without middleware for initial check)
authRouter.get('/check', userMiddleware, (req, res) => {
    try {
        const reply = {
            firstName: req.result.firstName,
            emailId: req.result.emailId,
            _id: req.result._id,
            role: req.result.role,
        }

        res.status(200).json({
            user: reply,
            message: "Valid User"
        });
    } catch (error) {
        console.error('Check auth error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Health check endpoint
authRouter.get('/health', (req, res) => {
    res.status(200).json({ message: 'Auth service is running' });
});

module.exports = authRouter;

