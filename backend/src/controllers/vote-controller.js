
const mongoose = require('mongoose');
const { getConnection } = require("../../db");
const { Candidate } = require("../../scripts/candiate_seeder");
const { Vote } = require("../models/vote_modal");
const json = require("../utils/json");

async function castVote(req, res) {
    try {
        await getConnection();

        // Parse JSON body
        let body = '';
        for await (const chunk of req) body += chunk;
        const { voterNumber, aadhaar, candidateId, stateId, districtId, assemblyId } = JSON.parse(body);

        console.log(voterNumber, aadhaar, candidateId, stateId, districtId, assemblyId, "chekc")
        // Basic validation
        if (!voterNumber || !aadhaar || !candidateId || !stateId || !districtId || !assemblyId) {
            return json(res, 400, { success: false, message: "All fields are required" });
        }

        // Check if voter already voted
        const existingVote = await Vote.findOne({ voterNumber });
        if (existingVote) {
            return json(res, 400, { success: false, message: "Voter has already voted" });
        }

        // Validate candidate exists and belongs to the same state/district/assembly
        const candidate = await Candidate.findById(candidateId);
        if (!candidate) {
            return json(res, 404, { success: false, message: "Candidate not found" });
        }
        if (
            candidate.state.toString() !== stateId ||
            candidate.district.toString() !== districtId ||
            candidate.assembly.toString() !== assemblyId
        ) {
            return json(res, 400, { success: false, message: "Candidate does not belong to the provided state/district/assembly" });
        }

        // Save vote
        const vote = new Vote({
            voterNumber,
            aadhaar,
            candidate: candidateId,
            state: stateId,
            district: districtId,
            assembly: assemblyId
        });

        await vote.save();

        return json(res, 200, { success: true, message: `Vote successfully cast to ${candidate.name}` });

    } catch (error) {
        console.error("Error casting vote:", error);
        return json(res, 500, { success: false, message: "Failed to cast vote" });
    }
}

module.exports = { castVote };