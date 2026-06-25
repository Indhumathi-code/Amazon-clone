const mysql = require('mysql2/promise');

async function run() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'amazon_clone',
    waitForConnections: true,
    connectionLimit: 10,
  });

  try {
    const [rows] = await pool.execute('SELECT * FROM products');
    console.log('PRODUCTS IN DB:', JSON.stringify(rows, null, 2));
  } catch (err) {
    console.error('Error querying DB:', err);
  } finally {
    await pool.end();
  }
}

run();
