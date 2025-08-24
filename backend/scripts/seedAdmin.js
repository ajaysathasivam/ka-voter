require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../src/models/db');


(async () => {
try {
const username = process.env.SEED_ADMIN_USER || 'admin';
const password = process.env.SEED_ADMIN_PASS || 'admin123';


const hash = await bcrypt.hash(password, 10);
const conn = await db.getConnection();
await conn.query('INSERT INTO admins (username, password_hash) VALUES (?, ?) ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)', [username, hash]);
conn.release();


console.log(`Seeded admin → username: ${username}, password: ${password}`);
process.exit(0);
} catch (err) {
console.error('Seed error:', err);
process.exit(1);
}
})();