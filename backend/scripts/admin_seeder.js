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


async function seedAdmins() {
    try {
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
        console.log('Admin Seeding complete and connection closed');
    } catch (err) {
        console.error('Error seeding admins:', err);
    }
}

module.exports = seedAdmins;
module.exports = Admin;