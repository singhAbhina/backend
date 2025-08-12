const redisClient = require("../config/redis");
const User = require("../models/user");
const validate = require("../utils/validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Submission = require("../models/submission");

// Helper Function to Set Auth Cookie (Production)
const setAuthCookie = (res, token) => {
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only true in production
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        maxAge: 60 * 60 * 1000,  // 1 hour
        domain: process.env.NODE_ENV === 'production' ? undefined : undefined, // Let browser handle domain
        path: '/'
    });
};

// Helper Function to Clear Auth Cookie (Production)
const clearAuthCookie = (res) => {
    res.cookie('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        expires: new Date(0),
        path: '/'
    });
};

// ================= Register =================
const register = async (req, res) => {
    try {
        validate(req.body);
        const { firstName, emailId, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ emailId });
        if (existingUser) {
            return res.status(400).json({ error: "User with this email already exists" });
        }

        req.body.password = await bcrypt.hash(password, 10);
        req.body.role = 'user';

        const user = await User.create(req.body);

        const token = jwt.sign(
            { _id: user._id, emailId: emailId, role: 'user' },
            process.env.JWT_KEY,
            { expiresIn: 60 * 60 } // 1 hour
        );

        const reply = {
            firstName: user.firstName,
            emailId: user.emailId,
            _id: user._id,
            role: user.role,
        };

        setAuthCookie(res, token);

        res.status(201).json({
            user: reply,
            message: "User registered successfully",
            token: token // Also send token in response for frontend storage
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(400).json({ error: err.message || "Registration failed" });
    }
};

// ================= Login =================
const login = async (req, res) => {
    try {
        const { emailId, password } = req.body;

        if (!emailId || !password)
            throw new Error("Invalid Credentials");

        const user = await User.findOne({ emailId });
        if (!user) throw new Error("Invalid Credentials");

        const match = await bcrypt.compare(password, user.password);
        if (!match) throw new Error("Invalid Credentials");

        const token = jwt.sign(
            { _id: user._id, emailId: emailId, role: user.role },
            process.env.JWT_KEY,
            { expiresIn: 60 * 60 } // 1 hour
        );

        const reply = {
            firstName: user.firstName,
            emailId: user.emailId,
            _id: user._id,
            role: user.role,
        };

        setAuthCookie(res, token);

        res.status(201).json({
            user: reply,
            message: "Logged in Successfully",
            token: token // Also send token in response for frontend storage
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(401).json({ error: err.message || "Login failed" });
    }
};

// ================= Logout =================
const logout = async (req, res) => {
    try {
        const { token } = req.cookies;
        const payload = jwt.decode(token);

        await redisClient.set(`token:${token}`, 'Blocked');
        await redisClient.expireAt(`token:${token}`, payload.exp);

        clearAuthCookie(res);

        res.send("Logged Out Successfully");
    } catch (err) {
        res.status(503).send("Error: " + err);
    }
};

// ================= Admin Register =================
const adminRegister = async (req, res) => {
    try {
        validate(req.body);
        const { firstName, emailId, password } = req.body;

        req.body.password = await bcrypt.hash(password, 10);

        const user = await User.create(req.body);

        const token = jwt.sign(
            { _id: user._id, emailId: emailId, role: user.role },
            process.env.JWT_KEY,
            { expiresIn: 60 * 60 } // 1 hour
        );

        setAuthCookie(res, token);

        res.status(201).send("User Registered Successfully");
    } catch (err) {
        res.status(400).send("Error: " + err);
    }
};

// ================= Delete Profile =================
const deleteProfile = async (req, res) => {
    try {
        const userId = req.result._id;

        await User.findByIdAndDelete(userId);

        // If you want to delete submissions:
        // await Submission.deleteMany({ userId });

        res.status(200).send("Deleted Successfully");
    } catch (err) {
        res.status(500).send("Internal Server Error");
    }
};

module.exports = { register, login, logout, adminRegister, deleteProfile };
