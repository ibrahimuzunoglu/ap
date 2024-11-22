require('dotenv').config(); 
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken'); 
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;

SECRET_KEY="vatanmilletsakarya";
MONGODB_URI="mongodb+srv://ibrahim:oZGNRekl3ltKTHxq@aracimipazarla.g7b0j.mongodb.net/aracimipazarla;"


app.use(cors());
app.use(express.json());
app.use(bodyParser.json());


app.use(cors({
    origin: 'http://127.0.0.1:5500', // HTML dosyanızın çalıştığı adres
    methods: ['GET', 'POST'], // Kabul edilen yöntemleri belirtin
    allowedHeaders: ['Content-Type', 'Authorization'], // İzin verilen başlıklar

}));

mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB’ye başarılı bir şekilde bağlanıldı'))
    .catch(err => console.error('MongoDB bağlantı hatası:', err));



app.get('/cars', async (req, res) => {
    try {
        const cars = await mongoose.connection.db.collection('cars').find({}).toArray();
        res.json(cars);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching car data' });
    }
});


app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor.`);
});