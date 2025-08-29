const http = require('http');
const url = require('url');
require('dotenv').config();
const { login } = require('./controllers/adminController');
const { verifyOtp } = require('./controllers/admin-verify-otp');
const { verifyUser } = require('./controllers/verify-user');
const { getAllStates, addState, removeState } = require('./controllers/stateController');
const { getAllCandidates, addCandidate, removeCandidate } = require('./controllers/candidateController');


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

        if (req.method === 'POST' && pathname === '/api/admin/verify-otp') {
            return verifyOtp(req, res);
        }

        if (req.method === 'POST' && pathname === '/api/admin/verify-user') {
            return verifyUser(req, res);
        }


        // States endpoints
        if (pathname === '/api/admin/states') {
            if (req.method === 'GET') return getAllStates(req, res);
            if (req.method === 'POST') return addState(req, res);
            // Other methods like PUT, DELETE can be handled if needed on this path
        }

        // Delete state by ID: e.g., /api/admin/states/{id}
        if (pathname.startsWith('/api/admin/states/')) {
            if (req.method === 'DELETE') {
                const id = pathname.split('/')[4]; // splits ['', 'api', 'admin', 'states', '{id}']
                return removeState(req, res, id);
            }
        }

        // Candidates endpoints
        if (pathname === '/api/admin/candidates') {
            if (req.method === 'GET') return getAllCandidates(req, res);
            if (req.method === 'POST') return addCandidate(req, res);
        }

        // Delete candidate by ID: /api/admin/candidates/{id}
        if (pathname.startsWith('/api/admin/candidates/')) {
            if (req.method === 'DELETE') {
                const id = pathname.split('/')[4];
                return removeCandidate(req, res, id);
            }
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