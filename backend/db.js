const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../database/aura.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    console.log('Connected to the SQLite database.');
    
    // Create products table
    db.run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price INTEGER NOT NULL,
      category TEXT NOT NULL,
      image TEXT NOT NULL,
      description TEXT,
      features TEXT,
      images TEXT
    )`, (err) => {
      // Ensure columns exist on older databases
      db.run("ALTER TABLE products ADD COLUMN description TEXT", () => {});
      db.run("ALTER TABLE products ADD COLUMN features TEXT", () => {});
      db.run("ALTER TABLE products ADD COLUMN images TEXT", () => {});
      if (err) {
        console.error('Error creating products table', err);
      } else {
        // Check if there are products
        db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
          if (row.count === 0) {
            // Seed data with more variety for the new pages
            const products = [
              { name: "Midnight Wayfarer", price: 129, category: "Mens", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80", description: "A classic design that never goes out of style. Perfect for long drives or beach days.", features: '["UV400 Protection", "Polarized", "Acetate Frame"]' },
              { name: "Amber Aviator", price: 145, category: "Mens", image: "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=800&q=80", description: "Timeless aviators with a modern amber tint.", features: '["Lightweight wire frame", "Adjustable nose pads"]' },
              { name: "Retro Tortoiseshell", price: 115, category: "Womens", image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80", description: "Vintage-inspired tortoiseshell pattern for a chic, classy look.", features: '["Polycarbonate lenses", "Scratch resistant"]' },
              { name: "Ocean Blue Round", price: 135, category: "Womens", image: "https://images.unsplash.com/photo-1625591342273-d1f568dc6297?auto=format&fit=crop&w=800&q=80", description: "Fun, circular frames with a vibrant ocean blue finish.", features: '["UVA/UVB Protection", "Hand-polished acetate"]' },
              { name: "Crystal Clear Glass", price: 159, category: "Polarized", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80", description: "Minimalist design featuring premium crystal clear frames and superior polarized lenses.", features: '["Polarized technology", "Anti-glare coating"]' },
              { name: "Jet Black Sport", price: 125, category: "Polarized", image: "https://images.unsplash.com/photo-1591076482161-421a3a0f63fc?auto=format&fit=crop&w=800&q=80", description: "Engineered for active lifestyles. Wrap-around design for maximum coverage.", features: '["Impact resistant", "Rubberized grips"]' },
              { name: "Leather Travel Case", price: 45, category: "Accessories", image: "https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&w=800&q=80", description: "Genuine leather case crafted to protect your shades on the go.", features: '["Genuine Leather", "Magnetic closure", "Microfiber interior"]' },
              { name: "Premium Cleaning Kit", price: 25, category: "Accessories", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80", description: "Keep your vision crystal clear with our eco-friendly cleaning solution.", features: '["Microfiber Cloth", "Anti-fog spray", "Travel pouch"]' }
            ];
            
            const stmt = db.prepare('INSERT INTO products (name, price, category, image, description, features) VALUES (?, ?, ?, ?, ?, ?)');
            products.forEach(p => {
              stmt.run(p.name, p.price, p.category, p.image, p.description, p.features);
            });
            stmt.finalize();
            console.log('Products seeded successfully.');
          }
        });
      }
    });

    // Create cart table
    // For anonymity and simplicity, we just use a global count for this demo.
    db.run(`CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      count INTEGER DEFAULT 0
    )`, (err) => {
      if (!err) {
        db.get('SELECT COUNT(*) as num FROM cart', (err, row) => {
          if (row.num === 0) {
            db.run('INSERT INTO cart (count) VALUES (0)');
          }
        });
      }
    });

    // Create cart_items table
    db.run(`CREATE TABLE IF NOT EXISTS cart_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      quantity INTEGER DEFAULT 1,
      FOREIGN KEY (product_id) REFERENCES products(id)
    )`);

    // Create reviews table
    db.run(`CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      rating INTEGER NOT NULL,
      reviewer_name TEXT NOT NULL,
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id)
    )`);

    // Create subscribers table
    db.run(`CREATE TABLE IF NOT EXISTS subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Create orders table (simulated)
    db.run(`CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      total_amount REAL NOT NULL,
      status TEXT DEFAULT 'Processing',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (!err) {
        db.get('SELECT COUNT(*) as num FROM orders', (err, row) => {
          if (row.num === 0) {
            db.run("INSERT INTO orders (customer_name, total_amount, status) VALUES ('John Doe', 129, 'Delivered')");
            db.run("INSERT INTO orders (customer_name, total_amount, status) VALUES ('Jane Smith', 260, 'Shipped')");
          }
        });
      }
    });
  }
});

module.exports = db;
