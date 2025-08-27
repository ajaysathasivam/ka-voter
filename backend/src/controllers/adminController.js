// const bcrypt = require('bcryptjs');
// const adminModel = require('../models/adminModel');
// const { signJwt } = require('../utils/jwt');




// async function login(req, res) {
//     try {
//         const chunks = [];
//         for await (const chunk of req) chunks.push(chunk);
//         const raw = Buffer.concat(chunks).toString('utf8');


//         let body;
//         try {
//             body = raw ? JSON.parse(raw) : {};
//         } catch (e) {
//             return json(res, 400, { success: false, message: 'Invalid JSON body' });
//         }
//         console.log('body', body)


//         const { username, password } = body;
//         if (!username || !password) {
//             return json(res, 400, { success: false, message: 'username and password are required' });
//         }


//         const admin = await adminModel.findByUsername(username);
//         console.log(admin, "admin")
//         if (!admin) {
//             return json(res, 401, { success: false, message: 'Invalid credentials' });
//         }


//         const ok = await bcrypt.compare(password, admin.password_hash);
//         if (!ok) {
//             return json(res, 401, { success: false, message: 'Invalid credentials' });
//         }


//         const token = signJwt({ sub: admin.id, username: admin.username, role: 'admin' });
//         return json(res, 200, {
//             success: true,
//             message: 'Login successful',
//             token,
//         });
//     } catch (err) {
//         console.error('Login error:', err);
//         return json(res, 500, { success: false, message: 'Internal Server Error' });
//     }
// }


// module.exports = { login };



const bcrypt = require('bcryptjs');
const { findByUsername } = require('../models/adminModel');
const crypto = require('crypto'); // to generate OTP
const json = require('../utils/json')

async function login(req, res) {
    try {
        const chunks = [];
        for await (const chunk of req) chunks.push(chunk);
        const raw = Buffer.concat(chunks).toString('utf8');

        let body;
        try {
            body = raw ? JSON.parse(raw) : {};
        } catch (e) {
            return json(res, 400, { success: false, message: 'Invalid JSON body' });
        }

        const { username, password } = body;
        if (!username || !password) {
            return json(res, 400, { success: false, message: 'username and password are required' });
        }

        const admin = await findByUsername(username);
        if (!admin) {
            return json(res, 401, { success: false, message: 'Invalid credentials' });
        }

        const ok = await bcrypt.compare(password, admin.password_hash);
        if (!ok) {
            return json(res, 401, { success: false, message: 'Invalid credentials' });
        }

        // Generate OTP
        const otp = crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);    // expires in 5 minutes

        // Save OTP to DB
        admin.otp = otp;
        admin.otp_expiry = otpExpiry;
        await admin.save();

        // TODO: send OTP via SMS/email using your preferred service
        console.log(otp, "test")
        return json(res, 200, {
            success: true,
            message: 'Login successful, OTP sent',
            otp_sent: true, // for dev/debug only
        });

    } catch (err) {
        console.error('Login error:', err);
        return json(res, 500, { success: false, message: 'Internal Server Error' });
    }
}

module.exports = { login }