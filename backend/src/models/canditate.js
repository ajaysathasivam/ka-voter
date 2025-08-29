const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    party: String,
    flag: String,
    profileUrl: String,
    description: String,
    experience: String,
    state: { type: mongoose.Schema.Types.ObjectId, ref: 'State', required: true },
    assembly: { type: mongoose.Schema.Types.ObjectId, required: true }
});

const Candidate = mongoose.model('Candidate', CandidateSchema);

module.exports = Candidate;
