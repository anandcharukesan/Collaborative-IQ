import mysql from "mysql2";
/////////Credntial here

const db = mysql.createConnection({
    host: 'mysql-83d1e8d-iqcollaborative-ea09.e.aivencloud.com',
    user: 'avnadmin',
    password: 'AVNS_7fXFdQalrC_FpC7bLrD',     
    database: 'collaborativeIq',
    port: 21505,
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

export default db;
