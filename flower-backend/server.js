const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const port = 3000;

// Ortak Ayarlar
const JWT_SECRET = process.env.JWT_SECRET || 'defaultSecretKey'; // Çevresel değişken yoksa varsayılan

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

// MySQL Bağlantısı
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234', // Şifreniz
  database: 'flower_shop',
  port: 3306,
});

db.connect((err) => {
  if (err) {
    console.error('Veritabanına bağlanılamadı:', err.message);
    process.exit(1);
  }
  console.log('Veritabanına başarıyla bağlanıldı.');
});

// Test Endpoint
app.get('/', (req, res) => {
  res.send('FlowerShop API çalışıyor!');
});

// Kullanıcı Kayıt Endpointi
app.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: 'Tüm alanlar zorunludur.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)';
    db.query(query, [firstName, lastName, email, hashedPassword], (err) => {
      if (err) {
        console.error('Kullanıcı kaydı başarısız:', err);
        return res.status(500).json({ error: 'Kullanıcı kaydedilemedi.' });
      }
      res.status(201).json({ message: 'Kayıt başarılı!' });
    });
  } catch (error) {
    console.error('Şifreleme hatası:', error);
    res.status(500).json({ error: 'Kayıt sırasında hata oluştu.' });
  }
});

// Kullanıcı Giriş Endpointi
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email ve şifre zorunludur.' });
  }

  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error('Veritabanı hatası:', err);
      return res.status(500).json({ error: 'Veritabanı hatası.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Şifre hatalı.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '1h',
    });

    // Kullanıcı bilgilerini token ile birlikte döndür
    res.json({
      message: 'Giriş başarılı',
      token,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  });
});


// Kategoriler Endpointi
app.get('/categories', (req, res) => {
  const query = 'SELECT * FROM categories';
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Kategoriler alınamadı.' });
    }
    res.json(results);
  });
});

// Ürünler Endpointi
app.get('/products/:category_id', (req, res) => {
  const categoryId = parseInt(req.params.category_id, 10);
  if (isNaN(categoryId)) {
    return res.status(400).json({ error: 'Geçersiz kategori ID.' });
  }
  const query = 'SELECT * FROM products WHERE category_id = ?';
  db.query(query, [categoryId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Ürünler alınamadı.' });
    }
    res.json(results);
  });
});

// Sipariş Oluşturma
app.post('/create-order', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Yetkilendirme hatası.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;
    const { products, total_price, status } = req.body;

    if (!products || !total_price || !status) {
      return res.status(400).json({ error: 'Eksik bilgiler.' });
    }

    const orderDate = new Date();
    const query = 'INSERT INTO orders (product_id, quantity, total_price, user_id, order_date, status) VALUES ?';

    const orderData = products.map((product) => [
      product.product_id,
      product.quantity,
      total_price, // Direkt total_price frontend'den geliyor
      userId,
      orderDate,
      status,
    ]);

    db.query(query, [orderData], (err) => {
      if (err) {
        console.error('Sipariş kaydı sırasında hata:', err);
        return res.status(500).json({ error: 'Sipariş kaydı başarısız.' });
      }
      res.status(201).json({ message: 'Sipariş başarılı!' });
    });
  } catch (error) {
    console.error('JWT doğrulama hatası:', error);
    res.status(401).json({ error: 'Yetkilendirme hatası.' });
  }
});


// Sunucuyu Başlat
app.listen(port, () => {
  console.log(`Sunucu http://localhost:${port} adresinde çalışıyor.`);
});
