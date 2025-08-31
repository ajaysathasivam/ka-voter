
const { Candidate } = require("../../scripts/candiate_seeder");
const { Vote } = require("../models/vote_modal");
const json = require("../utils/json");


async function getVoteCount(req, res,query) {
    try {
        const { stateId, districtId, assemblyId } = query;

        // Build candidate filter
        const candidateFilter = {};
        if (stateId) candidateFilter.state = stateId;
        if (districtId) candidateFilter.district = districtId;
        if (assemblyId) candidateFilter.assembly = assemblyId;

        // Fetch candidates matching filter
        const candidates = await Candidate.find(candidateFilter).lean();

        // Get vote counts for these candidates
        const candidateIds = candidates.map(c => c._id);

        const votes = await Vote.aggregate([
            { $match: { candidate: { $in: candidateIds } } },
            { $group: { _id: "$candidate", count: { $sum: 1 } } }
        ]);

        // Map votes by candidateId
        const voteMap = {};
        votes.forEach(v => {
            voteMap[v._id.toString()] = v.count;
        });

        // Combine candidates with vote counts (include 0 votes)
        const result = candidates.map(c => ({
            candidateId: c._id,
            name: c.name,
            party: c.party,
            votes: voteMap[c._id.toString()] || 0
        }));
        json(res, 200, result)

    } catch (err) {
        console.error(err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Internal Server Error' }));
    }
}

module.exports = { getVoteCount };
