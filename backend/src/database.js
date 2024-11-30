const mysql = require('mysql2'); // Use `mysql2` for better SSL support

const db = mysql.createConnection({
    host: 'mysql-83d1e8d-iqcollaborative-ea09.e.aivencloud.com',       // Example: 'mysql-12345.aivencloud.com'
    user: 'avnadmin',         // Provided by Aiven
    password: 'AVNS_7fXFdQalrC_FpC7bLrD',     // Provided by Aiven
    database: 'collaborativeIq',     // Your database name
    port: 21505,                   // Default port for Aiven MySQL
    ssl: {
        rejectUnauthorized: false, // Important for Aiven databases
    },
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to Aiven MySQL database.');
    }
});

module.exports = db;
