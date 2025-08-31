const { ObjectId } = require('mongodb');
const { getConnection } = require('../../db');
const { Candidate } = require('../../scripts/candiate_seeder');
const { State } = require('../../scripts/state_seeder');
const stateModal = require('../models/stateModal');
const json = require('../utils/json');

async function getAllCandidates(req, res) {
    try {
        await getConnection();

        // Fetch all candidates
        const candidates = await Candidate.find().exec();

        // Fetch all states with nested districts & assemblies
        const states = await stateModal.find().lean();

        // Map ids to names
        const enrichedCandidates = candidates.map(c => {
            const state = states.find(s => s._id.toString() === c.state.toString());
            let districtName = '';
            let assemblyName = '';

            if (state) {
                const district = state.districts.find(d => d._id.toString() === c.district.toString());
                if (district) {
                    districtName = district.name;
                    const assembly = district.assemblies.find(a => a._id.toString() === c.assembly.toString());
                    if (assembly) {
                        assemblyName = assembly.name;
                    }
                }
            }

            return {
                ...c.toObject(),
                stateName: state?.name || '',
                districtName,
                assemblyName
            };
        });


        json(res, 200, { success: true, message: 'Fetched successfully', data: enrichedCandidates });

    } catch (err) {
        console.error(err);
        res.writeHead(500);
        res.end('Error fetching candidates');
    }
}


async function getCandidates(req, res) {
    let body = '';
    req.on('data', chunk => { body += chunk; });

    req.on('end', async () => {
        try {

            // Parse body
            const { stateId, districtId, assemblyId } = JSON.parse(body);

            if (!stateId || !districtId || !assemblyId) {
                return json(res, 400, {
                    success: false,
                    message: "State, district, and assembly are required"
                });
            }

            await getConnection();

            // Verify state exists
            const state = await stateModal.findById(stateId);
            if (!state) {
                return json(res, 404, {
                    success: false,
                    message: "State not found"
                });
            }

            // Find district inside state
            const district = state.districts.find(
                d => d._id.toString() === districtId.toString()
            );
            if (!district) {
                return json(res, 404, {
                    success: false,
                    message: "District not found in this state"
                });
            }

            // Find assembly inside district
            const assembly = district.assemblies.find(
                a => a._id.toString() === assemblyId.toString()
            );
            if (!assembly) {
                return json(res, 404, {
                    success: false,
                    message: "Assembly not found in this district"
                });
            }

            // Fetch candidates
            const candidates = await Candidate.find({
                state: stateId,
                assembly: assemblyId
            });

            if (!candidates.length) {
                return json(res, 200, {
                    success: true,
                    message: "No candidates found",
                    data: []
                });
            }

            json(res, 200, {
                success: true,
                data: candidates
            });

        } catch (err) {
            console.error("Fetch Candidates Error:", err);
            json(res, 500, {
                success: false,
                message: "Failed to fetch candidates asdf"
            });
        }
    });
}

async function getCandidate(id, req, res) {
    try {

        await getConnection();
        const candidate = await Candidate.findById(id);

        if (!candidate) {
            json(res, 404, {
                success: false,
                message: "Candidate not found"
            });
        }

        json(res, 200, {
            success: true,
            data: candidate   // returns {} object, not array
        });

    } catch (error) {
        console.error("Error getCandidate:", error);
        json(res, 500, {
            success: false,
            message: "Failed to fetch candidate"
        });
    }
}

// async function addCandidate(req, res, id) {
//     let body = '';
//     req.on('data', chunk => { body += chunk; });
//     req.on('end', async () => {
//         try {
//             await getConnection();
//             const candidateData = JSON.parse(body);
//             const candidate = new Candidate(candidateData);
//             const saved = await candidate.save();
//             if (saved) {
//                 const message = {
//                     sucess: true,
//                     message: 'Candidate stored successfully.'
//                 }
//                 json(res, 201, message)
//             }
//         } catch (e) {
//             console.log(e, "err")
//             const error = {
//                 success: false,
//                 message: e._message || "custom error"
//             }
//             json(res, '422', error)
//         }
//     });
// }

async function addCandidate(req, res, id = null) {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
        try {
            await getConnection();
            const candidateData = JSON.parse(body);

            let result;

            if (id) {
                // Update existing candidate
                result = await Candidate.findByIdAndUpdate(id, candidateData, { new: true, runValidators: true });
                if (!result) {
                    return json(res, 404, { success: false, message: 'Candidate not found for update' });
                }
                return json(res, 200, { success: true, message: 'Candidate updated successfully', data: result });
            } else {
                // Create new candidate
                const candidate = new Candidate(candidateData);
                result = await candidate.save();
                return json(res, 201, { success: true, message: 'Candidate stored successfully', data: result });
            }

        } catch (e) {
            console.error(e);
            return json(res, 422, { success: false, message: e._message || e.message || "Error saving candidate" });
        }
    });
}

async function removeCandidate(req, res, id) {
    try {
        await getConnection();

        const result = await Candidate.findByIdAndDelete(id);

        if (!result) {
            return json(res, 404, { success: false, message: 'Candidate not found' });
        }

        return json(res, 200, { success: true, message: 'Candidate deleted successfully' });

    } catch (err) {
        console.error(err);
        return json(res, 500, { success: false, message: 'Error deleting candidate' });
    }
}

module.exports = { getAllCandidates, addCandidate, removeCandidate, getCandidates, getCandidate };

