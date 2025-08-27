require('dotenv').config();
const mongoose = require('mongoose');

let isConnected = false; // track connection state

async function getConnection() {
    if (isConnected) {
        return mongoose.connection;
    }

    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        isConnected = true;
        console.log('✅ MongoDB connected');
        return mongoose.connection;
    } catch (err) {
        console.error('❌ MongoDB connection error:', err);
        throw err;
    }
}

module.exports = { getConnection };
