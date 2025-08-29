const mongoose = require('mongoose');
const { Schema } = mongoose;


// State Schema
const AssemblySchema = new Schema({
  name: { type: String, required: true }
});

const StateSchema = new Schema({
  name: { type: String, required: true, unique: true },
  assemblies: [AssemblySchema]
});

const State = mongoose.model('State', StateSchema);


module.exports = { State };