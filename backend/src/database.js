import mysql from "mysql2";
/////////Credential here


db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to Aiven MySQL database.');
    }
});

export default db;
