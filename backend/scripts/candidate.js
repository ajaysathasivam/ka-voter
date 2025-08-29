const mongoose = require('mongoose');
const { Schema } = mongoose;



// Candidate Schema
const CandidateSchema = new Schema({
    name: { type: String, required: true },
    party: { type: String },
    flag: { type: String },
    profileUrl: { type: String },
    description: { type: String },
    experience: { type: String },
    state: { type: mongoose.Schema.Types.ObjectId, ref: 'State', required: true },
    assembly: { type: mongoose.Schema.Types.ObjectId, required: true }
});

const Candidate = mongoose.model('Candidate', CandidateSchema);

module.exports = { Candidate };
