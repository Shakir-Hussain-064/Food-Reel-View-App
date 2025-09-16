const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.routes');
const foodPartnerRoutes = require('./routes/food-partner.routes');
const cors = require('cors')
const path = require('path')

const app = express();
app.use(cookieParser());
app.use(express.json());  //middleware hai jisse data read karta hai server
// Allow requests from the deployed frontend and local dev origins
const allowedOrigins = [
  'https://food-reel-view-app.onrender.com',
  'https://food-reel-view-app-1.onrender.com',
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
    origin: function(origin, callback){
        // allow requests with no origin (like mobile apps or curl)
        if(!origin) return callback(null, true);
        if(allowedOrigins.indexOf(origin) === -1){
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));


app.get('/', (req,res)=>{
    res.send("Hello World");
})

app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/food-partner', foodPartnerRoutes);

// Serve frontend static files when in production (or when dist is present)
const distPath = path.join(__dirname, '..', '..', 'Frontend', 'dist');
try {
    app.use(express.static(distPath));

    // SPA fallback: return index.html for any non-API route so client-side routing works
    app.get(/^\/(?!api).*/, (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
    });
} catch (e) {
    // If dist isn't present (local dev), ignore — frontend likely served by Vite locally
}

module.exports = app;  