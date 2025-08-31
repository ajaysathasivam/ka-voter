const { getConnection } = require("../../db");
const State = require("../models/stateModal");

async function getAllStates(req, res) {
    try {
        await getConnection();
        const states = await State.find();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(states));
    } catch (e) {
        console.log('e', e)
        res.writeHead(500);
        res.end('Error fetching states');
    }
}

// async function getIndividual(value, req, res) {
//     try {
//         await getConnection();
//         const gotValue = await State.find(value); // either state, district, assembly
//         const res = gotValue ? { success: true, message: "Already Existed" } : { success: false, message: "Not Existed" }
//         res.writeHead(200, { 'Content-Type': 'application/json' });
//         res.end(JSON.stringify(res));
//     } catch (error) {
//         console.log(e, "get single eroro")
//         res.writeHead(500);
//         res.end('Error fetching states');
//     }

// }

// async function addState(req, res) {
//     let body = '';
//     req.on('data', chunk => { body += chunk; });
//     req.on('end', async () => {
//         try {
//             await getConnection();
//             const stateData = JSON.parse(body);
//             const state = new State(stateData);
//             const saved = await state.save();
//             res.writeHead(201, { 'Content-Type': 'application/json' });
//             res.end(JSON.stringify(saved));
//         } catch {
//             res.writeHead(400);
//             res.end('Invalid JSON or DB error');
//         }
//     });
// }

/// Utility: set CORS headers for every response
function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// Add or update state
async function addState(req, res) {
    setCorsHeaders(res);

    // Handle OPTIONS preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        return res.end();
    }

    let body = '';
    req.on('data', chunk => (body += chunk));

    req.on('end', async () => {
        try {
            await getConnection(); // Your MongoDB connection

            let stateData;
            try {
                stateData = JSON.parse(body);
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ success: false, error: 'Invalid JSON' }));
            }

            const { name, districts } = stateData;

            if (!name || !Array.isArray(districts)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ success: false, error: 'State name or districts missing' }));
            }

            // Clean and validate districts and assemblies
            const cleanedDistricts = districts
                .filter(d => d.name)
                .map(d => ({
                    name: d.name,
                    assemblies: Array.isArray(d.assemblies)
                        ? d.assemblies.filter(a => a.name).map(a => ({ name: a.name }))
                        : []
                }));

            if (cleanedDistricts.length === 0) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ success: false, error: 'No valid districts provided' }));
            }

            // Check if state exists
            let state = await State.findOne({ name });

            if (state) {
                // Update existing state: add districts/assemblies
                for (const d of cleanedDistricts) {
                    let existingDistrict = state.districts.find(dist => dist.name === d.name);

                    if (existingDistrict) {
                        for (const a of d.assemblies) {
                            if (!existingDistrict.assemblies.find(ass => ass.name === a.name)) {
                                existingDistrict.assemblies.push({ name: a.name });
                            } else {
                                return res.end(JSON.stringify({
                                    success: false,
                                    error: `Assembly '${a.name}' already exists in district '${d.name}' of state '${name}'`
                                }));
                            }
                        }
                    } else {
                        // Add new district
                        state.districts.push(d);
                    }
                }

                const saved = await state.save();
                return res.end(JSON.stringify({ success: true, data: saved }));

            } else {
                // Create new state
                const newState = new State({ name, districts: cleanedDistricts });
                const saved = await newState.save();
                res.writeHead(201, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ success: true, data: saved }));
            }

        } catch (error) {
            console.error(error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: error.message || 'DB error' }));
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

module.exports = { getAllStates, addState, removeState, };
