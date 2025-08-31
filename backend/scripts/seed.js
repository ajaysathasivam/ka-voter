require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const seedAdmins = require('./admin_seeder');
const { seedStates } = require('./state_seeder');
const { seedCandidate } = require('./candiate_seeder');


async function main() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');

        await seedAdmins();
        await seedStates();
        await seedCandidate();

        console.log("🎉 All seeding done!");
        process.exit(0);
    }
    catch (e) {
        console.error("❌ Seeding error:", e.message);
        process.exit(1);
    }
}
main()