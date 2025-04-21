const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'Rohan',
  password: 'root',
  database: 'social_media_platform'
});

db.connect((err) => {
  if (err) throw err;
  console.log('✅ MySQL Connected');
});

module.exports = db;
