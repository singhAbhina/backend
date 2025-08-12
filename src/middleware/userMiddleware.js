const jwt = require("jsonwebtoken");
const User = require("../models/user");
const redisClient = require("../config/redis")

const userMiddleware = async (req, res, next) => {
    try {
        // Try to get token from cookies first, then from Authorization header
        let token = req.cookies?.token;
        
        if (!token) {
            // Check Authorization header
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7);
            }
        }
        
        if (!token) {
            throw new Error("Token is not present");
        }

        const payload = jwt.verify(token, process.env.JWT_KEY);

        const { _id } = payload;

        if (!_id) {
            throw new Error("Invalid token");
        }

        const result = await User.findById(_id);

        if (!result) {
            throw new Error("User Doesn't Exist");
        }

        // Check if token is in Redis blocklist
        const IsBlocked = await redisClient.exists(`token:${token}`);

        if (IsBlocked) {
            throw new Error("Invalid Token");
        }

        req.result = result;
        next();
    } catch (err) {
        console.error('Middleware error:', err);
        res.status(401).json({ error: err.message });
    }
}

module.exports = userMiddleware;
