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
const bcrypt = require('bcrypt');

// Kullanıcı kayıt endpointi
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Parola şifreleme
  const hashedPassword = await bcrypt.hash(password, 10);

  // Kullanıcıyı veritabanına kaydet
  const query = 'INSERT INTO Users (name, email, password) VALUES (?, ?, ?)';
  db.query(query, [name, email, hashedPassword], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Kullanıcı kaydedilemedi' });
    }
    res.status(201).json({ message: 'Kayıt başarılı!' });
  });
});
const jwt = require('jsonwebtoken');

// Kullanıcı giriş endpointi
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Kullanıcıyı email ile bul
  const query = 'SELECT * FROM Users WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Hata oluştu' });
    if (results.length === 0) return res.status(404).json({ error: 'Kullanıcı bulunamadı' });

    const user = results[0];

    // Şifre kontrolü
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Şifre hatalı' });

    // JWT token oluştur
    const token = jwt.sign({ id: user.id, email: user.email }, 'secretKey', { expiresIn: '1h' });
    res.json({ message: 'Giriş başarılı', token });
  });
});

// Sunucuyu başlat
//commit kontrol
app.listen(port, () => {
  console.log(`Sunucu http://localhost:${3000} adresinde çalışıyor`);
});


