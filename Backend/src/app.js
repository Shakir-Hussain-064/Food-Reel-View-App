const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.routes');
const foodPartnerRoutes = require('./routes/food-partner.routes');
const cors = require('cors')

const app = express();
app.use(cookieParser());
app.use(express.json());  //middleware hai jisse data read karta hai server
app.use(cors({
    origin: ['https://food-reel-view-app.onrender.com'], 
    credentials: true
}));


app.get('/', (req,res)=>{
    res.send("Hello World");
})

app.use('https://food-reel-view-app-1.onrender.com/api/auth', authRoutes);
app.use('https://food-reel-view-app-1.onrender.com/api/food', foodRoutes);
app.use('https://food-reel-view-app-1.onrender.com/api/food-partner', foodPartnerRoutes);

module.exports = app;  