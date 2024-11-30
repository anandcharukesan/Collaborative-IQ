const mysql = require('mysql2'); // Use `mysql2` for better SSL support



db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to Aiven MySQL database.');
    }
});

module.exports = db;
