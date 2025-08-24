const bcrypt = require('bcryptjs');
const adminModel = require('../models/adminModel');
const { signJwt } = require('../utils/jwt');


function json(res, statusCode, data, headers = {}) {
    const body = JSON.stringify(data);
    res.writeHead(statusCode, {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        ...headers,
    });
    res.end(body);
}


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


        const admin = await adminModel.findByUsername(username);
        if (!admin) {
            return json(res, 401, { success: false, message: 'Invalid credentials' });
        }


        const ok = await bcrypt.compare(password, admin.password_hash);
        if (!ok) {
            return json(res, 401, { success: false, message: 'Invalid credentials' });
        }


        const token = signJwt({ sub: admin.id, username: admin.username, role: 'admin' });
        return json(res, 200, {
            success: true,
            message: 'Login successful',
            token,
        });
    } catch (err) {
        console.error('Login error:', err);
        return json(res, 500, { success: false, message: 'Internal Server Error' });
    }
}


module.exports = { login };