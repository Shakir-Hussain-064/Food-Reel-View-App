const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.routes');
const foodPartnerRoutes = require('./routes/food-partner.routes');
const cors = require('cors')

const app = express();
app.use(cookieParser());
app.use(express.json());  //middleware hai jisse data read karta hai server

// Configure CORS for both development and production
const allowedOrigins = [
    "http://localhost:5173",  // Local development
    "http://localhost:3000",  // Alternative local port
    process.env.FRONTEND_URL, // Production frontend URL
];

// Add additional origins from environment variable if provided
if (process.env.ADDITIONAL_ORIGINS) {
    allowedOrigins.push(...process.env.ADDITIONAL_ORIGINS.split(','));
}

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));


app.get('/', (req,res)=>{
    res.send("Site is working properly..");
})

app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/food-partner', foodPartnerRoutes);

module.exports = app;  