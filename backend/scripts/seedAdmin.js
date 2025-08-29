// require('dotenv').config();
// const bcrypt = require('bcryptjs');
// const db = require('../src/models/db');


// (async () => {
// try {
// const username = process.env.SEED_ADMIN_USER || 'admin';
// const password = process.env.SEED_ADMIN_PASS || 'admin123';


// const hash = await bcrypt.hash(password, 10);
// const conn = await db.getConnection();
// await conn.query('INSERT INTO admins (username, password_hash) VALUES (?, ?) ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)', [username, hash]);
// conn.release();


// console.log(`Seeded admin → username: ${username}, password: ${password}`);
// process.exit(0);
// } catch (err) {
// console.error('Seed error:', err);
// process.exit(1);
// }
// })();

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {Admin} = require('./admin.js');

async function seedAdmins() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');

        const admins = [
            { username: 'admin1', password: 'password123' },
        ];

        for (const { username, password } of admins) {
            const exists = await Admin.findOne({ username });
            if (exists) {
                console.log(`Admin ${username} already exists`);
                continue;
            }

            const salt = await bcrypt.genSalt(10);
            const password_hash = await bcrypt.hash(password, salt);

            const admin = new Admin({ username, password_hash });
            await admin.save();
            console.log(`Admin ${username} seeded`);
        }

        await mongoose.connection.close();
        console.log('Seeding complete and connection closed');
    } catch (err) {
        console.error('Error seeding admins:', err);
        await mongoose.connection.close();
    }
}

seedAdmins();
