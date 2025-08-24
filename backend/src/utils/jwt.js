const jwt = require('jsonwebtoken');
require('dotenv').config();


function signJwt(payload) {
return jwt.sign(payload, process.env.JWT_SECRET, {
expiresIn: process.env.JWT_EXPIRES_IN || '1d'
});
}


module.exports = { signJwt };