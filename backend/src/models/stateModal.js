// models/State.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Assembly Schema
const AssemblySchema = new Schema({
  name: { type: String, required: true }
});

// District Schema
const DistrictSchema = new Schema({
  name: { type: String, required: true },
  assemblies: [AssemblySchema]
});

// State Schema
const StateSchema = new Schema({
  name: { type: String, required: true },
  districts: [DistrictSchema]
});

module.exports = mongoose.models.State || mongoose.model('State', StateSchema);
