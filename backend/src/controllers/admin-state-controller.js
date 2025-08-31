// backend/adminStateApi.js

const State = require('../models/stateModal');
const json = require('../utils/json');
const { getConnection } = require('../../db');

// Helper: send JSON response

// GET all states with nested districts & assemblies, sorted alphabetically
async function getStates(req, res) {
    try {
        await getConnection();
        const states = await State.find().lean();

        // Sort states, districts, assemblies alphabetically
        states.sort((a, b) => a.name.localeCompare(b.name));
        states.forEach((state) => {
            state.districts.sort((a, b) => a.name.localeCompare(b.name));
            state.districts.forEach(d => d.assemblies.sort((a, b) => a.name.localeCompare(b.name)));
        });

        json(res, 200, states);
    } catch (e) {
        console.log(e);
        json(res, 500, { success: false, message: 'Error fetching states' });
    }
}

// CREATE state
async function createState(req, res) {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', async () => {
        try {
            const { name } = JSON.parse(body);
            if (!name || !name.trim()) return json(res, 422, { success: false, message: 'Name is required' });

            await getConnection();
            const state = new State({ name: name.trim(), districts: [] });
            await state.save();
            json(res, 201, { success: true, message: 'State created' });
        } catch (e) {
            console.log(e);
            json(res, 500, { success: false, message: 'Error creating state' });
        }
    });
}

// UPDATE state
async function updateState(req, res, id) {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', async () => {
        try {
            const { name } = JSON.parse(body);
            if (!name || !name.trim()) return json(res, 422, { success: false, message: 'Name is required' });

            await getConnection();
            const updated = await State.findByIdAndUpdate(id, { name: name.trim() });
            if (!updated) return json(res, 404, { success: false, message: 'State not found' });

            json(res, 200, { success: true, message: 'State updated' });
        } catch (e) {
            console.log(e);
            json(res, 500, { success: false, message: 'Error updating state' });
        }
    });
}

// DELETE state + nested districts & assemblies
async function deleteState(req, res, id) {
    try {
        await getConnection();
        const deleted = await State.findByIdAndDelete(id);
        if (!deleted) return json(res, 404, { success: false, message: 'State not found' });
        json(res, 200, { success: true, message: 'Deleted' });
    } catch (e) {
        console.log(e);
        json(res, 500, { success: false, message: 'Error deleting state' });
    }
}

// CREATE district
async function createDistrict(req, res) {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', async () => {
        try {
            const { stateId, name } = JSON.parse(body);
            if (!stateId) return json(res, 422, { success: false, message: 'StateId is required' });
            if (!name || !name.trim()) return json(res, 422, { success: false, message: 'Name is required' });

            await getConnection();
            const state = await State.findById(stateId);
            if (!state) return json(res, 404, { success: false, message: 'State not found' });

            state.districts.push({ name: name.trim(), assemblies: [] });
            await state.save();
            json(res, 201, { success: true, message: 'District created' });
        } catch (e) {
            console.log(e);
            json(res, 500, { success: false, message: 'Error creating district' });
        }
    });
}

// UPDATE district
async function updateDistrict(req, res, id, stateId) {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', async () => {
        try {
            const { name } = JSON.parse(body);
            if (!name || !name.trim()) return json(res, 422, { success: false, message: 'Name is required' });

            await getConnection();
            const state = await State.findById(stateId);
            if (!state) return json(res, 404, { success: false, message: 'State not found' });

            const district = state.districts.id(id);
            if (!district) return json(res, 404, { success: false, message: 'District not found' });

            district.name = name.trim();
            await state.save();
            json(res, 200, { success: true, message: 'District updated' });
        } catch (e) {
            console.log(e);
            json(res, 500, { success: false, message: 'Error updating district' });
        }
    });
}

// DELETE district + assemblies
async function deleteDistrict(req, res, id, stateId) {
    try {
        await getConnection();
        const state = await State.findById(stateId);
        if (!state) return json(res, 404, { success: false, message: 'State not found' });

        // Remove district using pull()
        const district = state.districts.id(id);
        if (!district) return json(res, 404, { success: false, message: 'District not found' });

        state.districts.pull(id); // <-- safe way
        await state.save();
        json(res, 200, { success: true, message: 'Deleted' });
    } catch (e) {
        console.log(e);
        json(res, 500, { success: false, message: 'Error deleting district' });
    }
}


// CREATE assembly
async function createAssembly(req, res) {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', async () => {
        try {
            const { districtId, name } = JSON.parse(body);
            if (!districtId) return json(res, 422, { success: false, message: 'DistrictId is required' });
            if (!name || !name.trim()) return json(res, 422, { success: false, message: 'Name is required' });

            await getConnection();
            const state = await State.findOne({ "districts._id": districtId });
            if (!state) return json(res, 404, { success: false, message: 'District not found' });

            const district = state.districts.id(districtId);
            district.assemblies.push({ name: name.trim() });
            await state.save();
            json(res, 201, { success: true, message: 'Assembly created' });
        } catch (e) {
            console.log(e);
            json(res, 500, { success: false, message: 'Error creating assembly' });
        }
    });
}

// UPDATE assembly
async function updateAssembly(req, res, id, districtId) {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', async () => {
        try {
            const { name } = JSON.parse(body);
            if (!name || !name.trim()) return json(res, 422, { success: false, message: 'Name is required' });

            await getConnection();
            const state = await State.findOne({ "districts._id": districtId });
            if (!state) return json(res, 404, { success: false, message: 'District not found' });

            const district = state.districts.id(districtId);
            const assembly = district.assemblies.id(id);
            if (!assembly) return json(res, 404, { success: false, message: 'Assembly not found' });

            assembly.name = name.trim();
            await state.save();
            json(res, 200, { success: true, message: 'Assembly updated' });
        } catch (e) {
            console.log(e);
            json(res, 500, { success: false, message: 'Error updating assembly' });
        }
    });
}

// DELETE assembly
async function deleteAssembly(req, res, id, districtId) {
    try {
        await getConnection();
        const state = await State.findOne({ "districts._id": districtId });
        if (!state) return json(res, 404, { success: false, message: 'District not found' });

        const district = state.districts.id(districtId);
        const assembly = district.assemblies.id(id);
        if (!assembly) return json(res, 404, { success: false, message: 'Assembly not found' });


        district.assemblies.pull(id)
        await state.save();
        json(res, 200, { success: true, message: 'Deleted' });
    } catch (e) {
        console.log(e);
        json(res, 500, { success: false, message: 'Error deleting assembly' });
    }
}

// GET all states + districts + assemblies nested
async function getAllNested(req, res) {
    try {
        await getConnection();
        const states = await State.find().lean();
        states.sort((a, b) => a.name.localeCompare(b.name));
        states.forEach(state => {
            state.districts.sort((a, b) => a.name.localeCompare(b.name));
            state.districts.forEach(d => d.assemblies.sort((a, b) => a.name.localeCompare(b.name)));
        });
        json(res, 200, states);
    } catch (e) {
        console.log(e);
        json(res, 500, { success: false, message: 'Error fetching data' });
    }
}

module.exports = {
    getStates,
    createState,
    updateState,
    deleteState,
    createDistrict,
    updateDistrict,
    deleteDistrict,
    createAssembly,
    updateAssembly,
    deleteAssembly,
    getAllNested
};
