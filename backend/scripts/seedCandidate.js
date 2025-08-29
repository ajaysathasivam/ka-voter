const { Candidate } = require("./candidate");
const { State } = require("./state");


async function seedData() {
    // Clear existing
    await State.deleteMany({});
    await Candidate.deleteMany({});

    // Insert States with Assemblies
    const states = await State.insertMany([
        { name: 'Uttar Pradesh', assemblies: [{ name: 'Lucknow' }, { name: 'Varanasi' }, { name: 'Kanpur' }] },
        { name: 'Bihar', assemblies: [{ name: 'Patna' }, { name: 'Gaya' }, { name: 'Muzaffarpur' }] },
        { name: 'Maharashtra', assemblies: [{ name: 'Mumbai' }, { name: 'Pune' }, { name: 'Nagpur' }] },
    ]);

    // Find needed state and assembly ids
    const upState = states.find(s => s.name === 'Uttar Pradesh');
    const lucknowAssembly = upState.assemblies.find(a => a.name === 'Lucknow');

    // Create candidate referring to state and assembly by id
    const candidate = new Candidate({
        name: "Ravi Singh",
        party: "Party A",
        flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Flag_of_India.svg/1200px-Flag_of_India.svg.png",
        profileUrl: "/public/profile.jpg",
        description: "Focused on youth employment and digital India initiatives.",
        experience: "5 years as MLA, former IT Minister",
        state: upState._id,
        assembly: lucknowAssembly._id,
    });

    await Candidate.save();
}

seedData().then(() => {
    console.log('Dummy data seeded successfully');
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
