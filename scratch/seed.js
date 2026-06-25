const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Helper to parse .env.local file
function parseEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('.env.local file not found');
    return {};
  }
  const content = fs.readFileSync(envPath, 'utf8');
  const config = {};
  content.split('\n').forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let key = match[1];
      let value = match[2] || '';
      if (value.length > 0 && value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      }
      config[key] = value.trim();
    }
  });
  return config;
}

async function main() {
  const env = parseEnv();
  const dbHost = env.DB_HOST || 'localhost';
  const dbUser = env.DB_USER || 'root';
  const dbPassword = env.DB_PASSWORD || '';
  const dbName = env.DB_NAME || 'amazon_clone';

  console.log(`Connecting to MySQL host: ${dbHost}, user: ${dbUser}, db: ${dbName}...`);

  // Connect without database first to ensure database exists
  let connection;
  try {
    connection = await mysql.createConnection({
      host: dbHost,
      user: dbUser,
      password: dbPassword
    });
  } catch (error) {
    console.error('Failed to connect to MySQL:', error.message);
    process.exit(1);
  }

  // Create database
  console.log(`Creating database ${dbName} if not exists...`);
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
  await connection.query(`USE \`${dbName}\``);

  // Create tables
  console.log('Creating users table...');
  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      mobile VARCHAR(20) NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('Creating products table...');
  await connection.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      original_price DECIMAL(10,2),
      image_url VARCHAR(500),
      category VARCHAR(100),
      rating DECIMAL(2,1) DEFAULT 4.0,
      reviews INT DEFAULT 0,
      badge VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Clear existing products to ensure clean seed
  console.log('Clearing existing products...');
  await connection.query('DELETE FROM products');
  await connection.query('ALTER TABLE products AUTO_INCREMENT = 1');

  // Insert items
  console.log('Seeding products...');
  const products = [
    // Deals/Continue Shopping (1-4)
    {
      title: 'AmazonBasics Optical Wireless Mouse',
      price: 299,
      original_price: 499,
      image_url: '/wireless_mouse.png',
      category: 'Deals',
      rating: 4.2,
      reviews: 1420,
      badge: 'Deal'
    },
    {
      title: 'Lunch Box 4 Compartment Stainless Steel',
      price: 599,
      original_price: 999,
      image_url: '/stainless_lunchbox.png',
      category: 'Deals',
      rating: 4.3,
      reviews: 1520,
      badge: 'Best Seller'
    },
    {
      title: 'Geonix 16GB USB 3.0 Flash Drive',
      price: 299,
      original_price: 499,
      image_url: '/usb_drive.png',
      category: 'Deals',
      rating: 4.1,
      reviews: 890,
      badge: null
    },
    {
      title: 'Kids Lunch Box with Bottle Set',
      price: 449,
      original_price: 799,
      image_url: '/kids_lunchbox.png',
      category: 'Deals',
      rating: 4.5,
      reviews: 2340,
      badge: 'Prime'
    },

    // Appliances (5-8)
    {
      title: 'Panasonic 2.0 Ton Inverter Split AC',
      price: 61989,
      original_price: 79500,
      image_url: '/split_ac.png',
      category: 'Appliances',
      rating: 4.4,
      reviews: 5600,
      badge: 'Deal'
    },
    {
      title: 'LG 260L Double Door Refrigerator',
      price: 24990,
      original_price: 35000,
      image_url: '/refrigerator.png',
      category: 'Appliances',
      rating: 4.3,
      reviews: 3200,
      badge: 'Deal'
    },
    {
      title: 'IFB 25L Convection Microwave',
      price: 12999,
      original_price: 18000,
      image_url: '/microwave.png',
      category: 'Appliances',
      rating: 4.4,
      reviews: 4100,
      badge: null
    },
    {
      title: 'Samsung 7kg Fully Automatic Washing Machine',
      price: 18990,
      original_price: 25000,
      image_url: '/washing_machine.png',
      category: 'Appliances',
      rating: 4.5,
      reviews: 7800,
      badge: 'Best Seller'
    },

    // Home Style (9-12)
    {
      title: 'Cushion covers, bedsheets & more',
      price: 399,
      original_price: 799,
      image_url: '/cushion_covers.png',
      category: 'HomeStyle',
      rating: 4.2,
      reviews: 450,
      badge: 'New'
    },
    {
      title: 'Figurines, vases & home decor',
      price: 499,
      original_price: 999,
      image_url: '/figurines.png',
      category: 'HomeStyle',
      rating: 4.5,
      reviews: 1280,
      badge: 'Best Seller'
    },
    {
      title: 'Home storage baskets and organizer',
      price: 699,
      original_price: 1299,
      image_url: '/home_storage.png',
      category: 'HomeStyle',
      rating: 4.3,
      reviews: 930,
      badge: 'Prime'
    },
    {
      title: 'Designer lighting solutions & lamps',
      price: 899,
      original_price: 1999,
      image_url: '/lighting_solutions.png',
      category: 'HomeStyle',
      rating: 4.1,
      reviews: 670,
      badge: null
    }
  ];

  for (const p of products) {
    await connection.query(
      'INSERT INTO products (title, price, original_price, image_url, category, rating, reviews, badge) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [p.title, p.price, p.original_price, p.image_url, p.category, p.rating, p.reviews, p.badge]
    );
  }

  console.log('Seeding completed successfully!');
  await connection.end();
}

main().catch(console.error);
