const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// API Endpoints

// Get all products (with optional category filter)
app.get('/api/products', (req, res) => {
  const { category } = req.query;
  let query = 'SELECT * FROM products';
  let params = [];

  if (category) {
    query += ' WHERE category = ?';
    params.push(category);
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get a single product by ID
app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(row);
  });
});

// Get cart items and count
app.get('/api/cart', (req, res) => {
  const query = `
    SELECT ci.id, ci.product_id, ci.quantity, p.name, p.price, p.image, p.category
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    const count = rows.reduce((total, item) => total + item.quantity, 0);
    res.json({ count, items: rows });
  });
});

// Add item to cart
app.post('/api/cart', (req, res) => {
  const { productId } = req.body;
  if (!productId) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  // Check if item exists, then update or insert
  db.get('SELECT id, quantity FROM cart_items WHERE product_id = ?', [productId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (row) {
      db.run('UPDATE cart_items SET quantity = quantity + 1 WHERE id = ?', [row.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
      });
    } else {
      db.run('INSERT INTO cart_items (product_id, quantity) VALUES (?, 1)', [productId], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, id: this.lastID });
      });
    }
  });
});

// Remove item from cart (reduce quantity or delete)
app.delete('/api/cart/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM cart_items WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Subscribe to newsletter
app.post('/api/subscribe', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  
  db.run('INSERT INTO subscribers (email) VALUES (?)', [email], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        return res.status(400).json({ error: 'Email already subscribed' });
      }
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true, id: this.lastID });
  });
});

// Admin: Get all subscribers
app.get('/api/subscribers', (req, res) => {
  db.all('SELECT * FROM subscribers ORDER BY subscribed_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Admin: Add a new product
app.post('/api/products', (req, res) => {
  const { name, price, category, image, description, features, images } = req.body;
  if (!name || !price || !category || !image) {
    return res.status(400).json({ error: 'Name, price, category, and image are required' });
  }
  db.run('INSERT INTO products (name, price, category, image, description, features, images) VALUES (?, ?, ?, ?, ?, ?, ?)', [name, price, category, image, description, features, images], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, id: this.lastID });
  });
});

// Admin: Update an existing product
app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, price, category, image, description, features, images } = req.body;
  db.run('UPDATE products SET name = ?, price = ?, category = ?, image = ?, description = ?, features = ?, images = ? WHERE id = ?', [name, price, category, image, description, features, images, id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Admin: Delete a product
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM products WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Admin: Get all orders
app.get('/api/orders', (req, res) => {
  db.all('SELECT * FROM orders ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Reviews: Get all reviews for a product
app.get('/api/products/:id/reviews', (req, res) => {
  const { id } = req.params;
  db.all('SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC', [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Reviews: Add a review
app.post('/api/products/:id/reviews', (req, res) => {
  const { id } = req.params;
  const { rating, reviewer_name, comment } = req.body;
  if (!rating || !reviewer_name) {
    return res.status(400).json({ error: 'Rating and name are required' });
  }
  db.run('INSERT INTO reviews (product_id, rating, reviewer_name, comment) VALUES (?, ?, ?, ?)', [id, rating, reviewer_name, comment], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, id: this.lastID });
  });
});

// Admin: Get all reviews
app.get('/api/reviews', (req, res) => {
  const query = `
    SELECT r.*, p.name as product_name, p.image as product_image 
    FROM reviews r
    JOIN products p ON r.product_id = p.id
    ORDER BY r.created_at DESC
  `;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`API Server running on port ${PORT}`);
});
