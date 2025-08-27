const {Admin} = require('../../scripts/admin');
const { getConnection } = require('../../db')
async function findByUsername(username) {
    try {
        await getConnection()
        return await Admin.findOne({ username }).exec();
    } catch (error) {
        console.error('db', error)
    }

}

module.exports = {
    findByUsername,
};
