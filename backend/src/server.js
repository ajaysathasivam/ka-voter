const http = require('http');
const url = require('url');
require('dotenv').config();
const { login } = require('./controllers/adminController');


const PORT = Number(process.env.PORT || 4000);


function sendNotFound(res) {
    res.writeHead(404, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ success: false, message: 'Not Found' }));
}


function handleCors(req, res) {
    // Basic CORS for preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '86400',
        });
        res.end();
        return true;
    }
    return false;
}


const server = http.createServer(async (req, res) => {
    try {
        if (handleCors(req, res)) return; // OPTIONS handled


        const parsed = url.parse(req.url, true);
        const pathname = parsed.pathname || '';


        if (req.method === 'POST' && pathname === '/api/admin/login') {
            return login(req, res);
        }


        sendNotFound(res);
    } catch (err) {
        console.error('Server error:', err);
        res.writeHead(500, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify({ success: false, message: 'Internal Server Error' }));
    }
});


server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});