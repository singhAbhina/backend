const express = require('express')
const app = express();
require('dotenv').config();
const main =  require('./config/db')
const cookieParser =  require('cookie-parser');
const authRouter = require("./routes/userAuth");
const redisClient = require('./config/redis');
const problemRouter = require("./routes/problemCreator");
const submitRouter = require("./routes/submit")
const aiRouter = require("./routes/aiChatting")
const videoRouter = require("./routes/videoCreator");
const cors = require('cors')

// console.log("Hello")
//console.log("hello")

app.use(cookieParser());

// Updated CORS configuration for production deployment
app.use(cors({
    origin: [
        'https://frontend-64pi.onrender.com',
        'http://localhost:5173', // Keep local development
        process.env.FRONTEND_URL // Add environment variable for flexibility
    ].filter(Boolean), // Remove undefined values
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie']
}))

app.use(express.json());

// Add error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.use('/user',authRouter);
app.use('/problem',problemRouter);
app.use('/submission',submitRouter);
app.use('/ai',aiRouter);
app.use("/video",videoRouter);


const InitalizeConnection = async ()=>{
    try{

        await Promise.all([main(),redisClient.connect()]);
        console.log("DB Connected");
        
        const port = process.env.PORT || 3000;
        const host = '0.0.0.0'; // Bind to all interfaces
        
        app.listen(port, host, ()=>{
            console.log(`🚀 Server running on http://${host}:${port}`);
            console.log(`🌐 Local access: http://localhost:${port}`);
            console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
        })

    }
    catch(err){
        console.log("Error: "+err);
    }
}


InitalizeConnection();

