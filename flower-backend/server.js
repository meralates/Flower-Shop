// Gerekli modülleri yükle
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const port = 3000;

// JWT için gizli anahtar
const JWT_SECRET = process.env.JWT_SECRET || 'defaultSecretKey';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

// MySQL bağlantısı
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'flower',
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
  const { email, password, firstName, lastName } = req.body;

  // Eksik alan kontrolü
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: 'Tüm alanlar doldurulmalıdır.' });
  }

  try {
    // Şifreyi hash'le
    const hashedPassword = await bcrypt.hash(password, 10);

    // Kullanıcıyı veritabanına ekle
    const query = 'INSERT INTO users (email, password, firstName, lastName) VALUES (?, ?, ?, ?)';
    db.query(query, [email, hashedPassword, firstName, lastName], (err) => {
      if (err) {
        console.error('Kullanıcı kaydı başarısız:', err);
        return res.status(500).json({ error: 'Kullanıcı kaydedilemedi.' });
      }
      res.status(201).json({ message: 'Kullanıcı başarıyla kaydedildi!' });
    });
  } catch (error) {
    console.error('Şifreleme hatası:', error);
    res.status(500).json({ error: 'Kayıt sırasında bir hata oluştu.' });
  }
});

// Kullanıcı Giriş Endpointi
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Eksik alan kontrolü
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

    const token = jwt.sign(
      { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Giriş başarılı',
      token,
      user: { firstName: user.firstName, lastName: user.lastName },
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

// Sipariş Ekle Endpointi
app.post('/add-to-cart', (req, res) => {
  const { productId, quantity, customerName, customerEmail } = req.body;

  if (!productId || !quantity || !customerName || !customerEmail) {
    return res.status(400).json({ error: 'Tüm alanlar doldurulmalıdır.' });
  }

  const productQuery = 'SELECT price FROM products WHERE id = ?';
  db.query(productQuery, [productId], (err, results) => {
    if (err || results.length === 0) {
      console.error(err);
      return res.status(500).json({ error: 'Ürün bilgisi alınamadı.' });
    }

    const productPrice = results[0].price;
    const totalPrice = productPrice * quantity;
    const orderDate = new Date();
    const status = 'Pending';

    const orderQuery = 'INSERT INTO orders (product_id, quantity, total_price, customer_name, customer_email, order_date, status) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(orderQuery, [productId, quantity, totalPrice, customerName, customerEmail, orderDate, status], (err) => {
      if (err) {
        console.error('Sipariş kaydedilemedi:', err);
        return res.status(500).json({ error: 'Sipariş kaydedilemedi.' });
      }
      res.status(201).json({ message: 'Sipariş başarıyla kaydedildi!' });
    });
  });
});

// Sunucuyu Başlat
app.listen(port, () => {
  console.log(`Sunucu http://localhost:${port} adresinde çalışıyor.`);
});
