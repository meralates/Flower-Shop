const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Bağlantısı
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // MySQL kullanıcı adın
  password: '1234', // MySQL şifren
  database: 'flower_shop', // Veritabanı adı
});

db.connect((err) => {
  if (err) {
    console.error('Veritabanına bağlanılamadı:', err);
  } else {
    console.log('Veritabanına başarıyla bağlanıldı.');
  }
});

// Basit bir test endpointi
app.get('/', (req, res) => {
  res.send('FlowerShop API çalışıyor!');
});

// Sunucuyu başlat
app.listen(port, () => {
  console.log(`Sunucu http://localhost:${3000} adresinde çalışıyor`);
});
