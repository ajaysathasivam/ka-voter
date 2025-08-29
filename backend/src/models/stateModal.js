const mongoose = require('mongoose');

const AssemblySchema = new mongoose.Schema({
    name: { type: String, required: true }
});

const StateSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    assemblies: [AssemblySchema]
});

const State = mongoose.model('State', StateSchema);

module.exports = State;
