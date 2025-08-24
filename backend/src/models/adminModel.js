const db = require('./db');


async function findByUsername(username) {
const rows = await db.query('SELECT id, username, password_hash FROM admins WHERE username = ? LIMIT 1', [username]);
return rows[0] || null;
}


module.exports = {
findByUsername,
};