const mongoose = require('mongoose');
const { Schema } = mongoose;
const State = require('../src/models/stateModal')



// Candidate Schema
const CandidateSchema = new Schema({
    name: { type: String, required: true },
    party: { type: String },
    flag: { type: String },
    profileUrl: { type: String },
    description: { type: String },
    experience: { type: String },
    state: { type: mongoose.Schema.Types.ObjectId, ref: 'State', required: true },
    assembly: { type: mongoose.Schema.Types.ObjectId, required: true },
    district: { type: mongoose.Schema.Types.ObjectId, required: true }

});

const Candidate = mongoose.model('Candidate', CandidateSchema);


async function seedCandidate() {
    try {
        // 1. Find Karnataka state
        const state = await State.findOne({ name: "Maharashtra" });
        if (!state) {
            console.error("❌ State 'Maharashtra' not found. Seed states first.");
            return;
        }

        console.log(state, "state1")
        // 2. Find the district inside that state
        const district = state.districts.find(d => d.name === "Pune");
        if (!district) {
            console.error("❌ District not found in Pune.");
            return;
        }

        // 3. Find the assembly inside that district
        const assembly = district.assemblies.find(a => a.name === "Kothrud");
        if (!assembly) {
            console.error("❌ Assembly 'Kothrud' not found in district.");
            return;
        }

        // 3. Create Candidate
        const candidate = new Candidate({
            name: "Ravi Singh",
            party: "Party A",
            flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Flag_of_India.svg/1200px-Flag_of_India.svg.png",
            profileUrl: "/public/profile.jpg",
            description: "Focused on youth employment and digital India initiatives.",
            experience: "5 years as MLA, former IT Minister",
            state: state._id,
            district: district._id,
            assembly: assembly._id,
        });

        // 4. Save
        const saved = await candidate.save();
        console.log("✅ Candidate inserted:", saved);

    } catch (error) {
        console.error("❌ Error seeding candidate:", error.message);
    }
}


module.exports = { seedCandidate, Candidate };