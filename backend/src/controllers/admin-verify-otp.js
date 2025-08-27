const { findByUsername } = require('../models/adminModel');
const json = require('../utils/json');
const { signJwt } = require('../utils/jwt')
async function verifyOtp(req, res) {
    try {
        const chunks = [];
        for await (const chunk of req) chunks.push(chunk);
        const raw = Buffer.concat(chunks).toString('utf8');

        const { username, otp } = JSON.parse(raw);

        const admin = await findByUsername(username);
        if (!admin) {
            return json(res, 401, { success: false, message: 'Invalid username' });
        }

        if (admin.otp !== otp) {
            return json(res, 401, { success: false, message: 'Invalid OTP' });
        }

        if (admin.otp_expiry < new Date()) {
            return json(res, 401, { success: false, message: 'OTP expired' });
        }

        // OTP is valid → generate JWT
        const token = signJwt({ sub: admin.id, username: admin.username, role: 'admin' });

        // clear OTP
        admin.otp = null;
        admin.otp_expiry = null;
        admin.token = token
        await admin.save();

        return json(res, 200, {
            success: true,
            message: 'OTP verified, login complete',
            token,
        });

    } catch (err) {
        console.error('OTP verification error:', err);
        return json(res, 500, { success: false, message: 'Internal Server Error' });
    }
}


module.exports = { verifyOtp }