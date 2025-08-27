
// const mongoose = require('mongoose');
// const adminSchema = new mongoose.Schema({
//     username: { type: String, required: true, unique: true },
//     password_hash: { type: String, required: true },
//     created_at: { type: Date, default: Date.now }
// });

// const Admin = mongoose.model('Admin', adminSchema);

// module.exports = Admin;


// models/adminModel.js
const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    // token: { type: String, required: true, unique: true },
    otp: { type: String },           // store OTP
    otp_expiry: { type: Date },      // OTP expiry time
    created_at: { type: Date, default: Date.now }
});

const Admin = mongoose.model("Admin", adminSchema);

// helper method to find by username
// async function findByUsername(username) {
//     return await Admin.findOne({ username }).exec();
// }

module.exports = { Admin };









