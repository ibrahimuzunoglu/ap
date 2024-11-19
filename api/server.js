require('dotenv').config(); 
const express = require('express');
const serverless = require('serverless-http'); // Serverless dönüşümü için gerekli
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken'); 
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;

const SECRET_KEY = process.env.SECRET_KEY; 
const MONGODB_URI = process.env.MONGODB_URI; 


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


const userSchema = new mongoose.Schema({
    username: String,
    surname: String,
    email: { type: String, unique: true },
    password: String,
    phonenumber: String,
    location: String
});

const User = mongoose.model('User', userSchema);

app.post('/api/register', async (req, res) => {
    const { username, surname, email, password, phonenumber, location } = req.body;
    
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Bu email adresi zaten kayıtlı!' });
        }
        
        const newUser = new User({ username, surname, email, password, phonenumber, location });
        await newUser.save();
        res.json({ message: 'Kayıt başarılı!' });
    } catch (error) {
        res.status(500).json({ message: 'Kayıt sırasında hata oluştu', error });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const userSchema = await User.findOne({ email, password }); // Veritabanında kullanıcıyı arar
        if (userSchema) {
            const token = jwt.sign({ email: userSchema.email }, process.env.SECRET_KEY, { expiresIn: '12h' });
            return res.json({ message: 'Giriş başarılı!', token });
        } else {
            return res.status(401).json({ message: 'Geçersiz email veya şifre!' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Giriş sırasında hata oluştu', error });
    }
});

module.exports = app;
module.exports.handler = serverless(app);


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