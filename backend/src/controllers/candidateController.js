const { getConnection } = require('../../db');
const Candidate = require('../models/canditate');

async function getAllCandidates(req, res) {
    try {
        await getConnection();
        // Populate state name and assembly name for better info
        const candidates = await Candidate.find().populate('state', 'name').exec();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(candidates));
    } catch {
        res.writeHead(500);
        res.end('Error fetching candidates');
    }
}

async function addCandidate(req, res) {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
        try {
            await getConnection();
            const candidateData = JSON.parse(body);
            const candidate = new Candidate(candidateData);
            const saved = await candidate.save();
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(saved));
        } catch {
            res.writeHead(400);
            res.end('Invalid JSON or DB error');
        }
    });
}

async function removeCandidate(req, res, id) {
    try {
        await getConnection();
        const result = await Candidate.findByIdAndDelete(id);
        if (result) {
            res.writeHead(200);
            res.end('Deleted candidate');
        } else {
            res.writeHead(404);
            res.end('Candidate not found');
        }
    } catch {
        res.writeHead(500);
        res.end('Error deleting candidate');
    }
}

module.exports = { getAllCandidates, addCandidate, removeCandidate };
