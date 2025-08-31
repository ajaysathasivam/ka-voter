const http = require('http');
const url = require('url');
require('dotenv').config();
const { login } = require('./controllers/adminController');
const { verifyOtp } = require('./controllers/admin-verify-otp');
const { verifyUser } = require('./controllers/verify-user');
const { getAllCandidates, addCandidate, removeCandidate, getCandidates, getCandidate } = require('./controllers/candidateController');
const { castVote } = require('./controllers/vote-controller');
const { getStates, createState, updateState, deleteState,
    createDistrict, updateDistrict, deleteDistrict,
    createAssembly, updateAssembly, deleteAssembly,
} = require('./controllers/admin-state-controller');
const { getVoteCount } = require('./controllers/vote-count');


const PORT = Number(process.env.PORT || 4000);


function sendNotFound(res) {
    res.writeHead(404, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ success: false, message: 'Not Found 1' }));
}


function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
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
        setCorsHeaders(res);



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



        // Candidates endpoints
        if (pathname === '/api/admin/candidates') {
            if (req.method === 'POST') return getCandidates(req, res);
        }


        if (pathname.startsWith('/api/admin/add-candidate')) {
            const id = pathname.split('/')[4];
            if (req.method === 'POST' && !id) return addCandidate(req, res);
            if (req.method === 'PUT' && id) return addCandidate(req, res, id);
        }

        if (pathname === '/api/admin/all-candidates') {
            if (req.method === 'GET') return getAllCandidates(req, res)
        }

        // Delete candidate by ID: /api/admin/candidates/{id}
        if (pathname.startsWith('/api/admin/candidates/')) {
            if (req.method === 'DELETE') {
                const id = pathname.split('/')[4];
                return removeCandidate(req, res, id);
            }
            if (req.method === 'GET') {
                const id = pathname.split('/')[4];
                return getCandidate(id, req, res)
            }
        }

        if (pathname === '/api/vote' && req.method === 'POST') {
            return castVote(req, res);
        }



        // ---------- STATE ----------
        if (pathname === '/api/admin/states') {
            if (req.method === 'GET') return getStates(req, res);
            if (req.method === 'POST') return createState(req, res);
        }
        if (pathname.startsWith('/api/admin/states/')) {
            const id = pathname.split('/')[4];
            if (req.method === 'PUT') return updateState(req, res, id);
            if (req.method === 'DELETE') return deleteState(req, res, id);
        }

        // ---------- DISTRICT ----------
        if (pathname === '/api/admin/districts') {
            if (req.method === 'POST') return createDistrict(req, res);
        }
        if (pathname.startsWith('/api/admin/districts/')) {
            const id = pathname.split('/')[4];
            const stateId = parsed.query.stateId; 
            if (req.method === 'PUT') return updateDistrict(req, res, id, stateId);
            if (req.method === 'DELETE') return deleteDistrict(req, res, id, stateId);
        }

        // ---------- ASSEMBLY ----------
        if (pathname === '/api/admin/assemblies') {
            if (req.method === 'POST') return createAssembly(req, res);
        }

        if (pathname.startsWith('/api/admin/assemblies/')) {
            const id = pathname.split('/')[4];
            const { stateId, districtId } = parsed.query; 
            if (req.method === 'PUT') return updateAssembly(req, res, id, districtId);
            if (req.method === 'DELETE') return deleteAssembly(req, res, id, districtId);
        }

        // count vote
        if (pathname === '/api/admin/vote-count' && req.method === 'GET') {
            return getVoteCount(req, res, parsed.query);
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