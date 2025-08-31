const mongoose = require('mongoose');
const { Schema } = mongoose;

const VoteSchema = new Schema({
    voterNumber: { type: String, required: true, unique: true }, // ensures a voter can vote only once
    aadhaar: { type: String, required: true },
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
    state: { type: mongoose.Schema.Types.ObjectId, ref: 'State', required: true },
    district: { type: mongoose.Schema.Types.ObjectId, required: true },
    assembly: { type: mongoose.Schema.Types.ObjectId, required: true },
    createdAt: { type: Date, default: Date.now } // to track when the vote was cast
});

// Index for faster counting by candidate
VoteSchema.index({ candidate: 1 });

const Vote = mongoose.model('Vote', VoteSchema);

module.exports = { Vote };
