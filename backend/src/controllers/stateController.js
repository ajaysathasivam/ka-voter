const State = require("../models/stateModal");

async function getAllStates(req, res) {
    try {
        await getConnection();
        const states = await State.find();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(states));
    } catch (e) {
        res.writeHead(500);
        res.end('Error fetching states');
    }
}

async function addState(req, res) {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
        try {
            await getConnection();
            const stateData = JSON.parse(body);
            const state = new State(stateData);
            const saved = await state.save();
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(saved));
        } catch {
            res.writeHead(400);
            res.end('Invalid JSON or DB error');
        }
    });
}

async function removeState(req, res, id) {
    try {
        await getConnection();
        const result = await State.findByIdAndDelete(id);
        if (result) {
            res.writeHead(200);
            res.end('Deleted state');
        } else {
            res.writeHead(404);
            res.end('State not found');
        }
    } catch {
        res.writeHead(500);
        res.end('Error deleting state');
    }
}

module.exports = { getAllStates, addState, removeState };
