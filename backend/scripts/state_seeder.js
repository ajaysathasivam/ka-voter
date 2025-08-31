const mongoose = require('mongoose');
const { Schema } = mongoose;
const State = require("../src/models/stateModal");


// // Assembly Schema
// const AssemblySchema = new Schema({
//     name: { type: String, required: true }
// });

// // District Schema
// const DistrictSchema = new Schema({
//     name: { type: String, required: true,  },
//     assemblies: [AssemblySchema]
// });

// // State Schema
// const StateSchema = new Schema({
//     name: { type: String, required: true,  },
//     districts: [DistrictSchema]
// });

// const State = mongoose.model('State', StateSchema);

// Seeder
async function seedStates() {
    try {
        // Clear existing states
        await State.deleteMany({});
        console.log("🗑️ Old states cleared");

        // Seed data
        const states = [
            {
                name: "Tamil Nadu",
                districts: [
                    {
                        name: "Chennai",
                        assemblies: [
                            { name: "Thiru-Vi-Ka-Nagar" },
                            { name: "Egmore" },
                            { name: "Royapuram" }
                        ]
                    },
                    {
                        name: "Coimbatore",
                        assemblies: [
                            { name: "Coimbatore North" },
                            { name: "Coimbatore South" },
                            { name: "Singanallur" }
                        ]
                    }
                ]
            },
            {
                name: "Maharashtra",
                districts: [
                    {
                        name: "Mumbai",
                        assemblies: [
                            { name: "Mumbai South" },
                            { name: "Malabar Hill" },
                            { name: "Sion Koliwada" }
                        ]
                    },
                    {
                        name: "Pune",
                        assemblies: [
                            { name: "Kothrud" },
                            { name: "Shivajinagar" },
                            { name: "Haveli" }
                        ]
                    }
                ]
            }
        ];

        const inserted = await State.insertMany(states);
        console.log(`🎉 ${inserted.length} states inserted successfully!`);
    } catch (error) {
        console.error("❌ Seeding error:", error);
    }
}


module.exports = {seedStates}