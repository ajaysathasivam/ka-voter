// require('dotenv').config();
// const db = require('mariadb');

// async function createTable() {
//     const connection = await db.createConnection({
//         host: process.env.DB_HOST,
//         port: process.env.DB_PORT,
//         user: process.env.DB_USER,
//         password: process.env.DB_PASSWORD,
//         database: process.env.DB_NAME,
//     });

//     const createTableSQL = `
//     CREATE TABLE IF NOT EXISTS admins (
//       id INT AUTO_INCREMENT PRIMARY KEY,
//       username VARCHAR(255) NOT NULL UNIQUE,
//       password_hash VARCHAR(255) NOT NULL,
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     );
//   `;

//     try {
//         await connection.execute(createTableSQL);
//         console.log("Table 'admins' created or already exists.");
//     } catch (err) {
//         console.error("Error creating table:", err);
//     } finally {
//         await connection.end();
//     }
// }

// createTable();

