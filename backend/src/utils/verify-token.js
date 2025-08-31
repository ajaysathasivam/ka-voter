const jwt =require('jsonwebtoken')


const SECRET_KEY = process.env.JWT_SECRET;

async function verify_token(req, res) {
    // 1. Read token from headers
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.writeHead(401, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "No token provided" }));
    }
    const token = authHeader.split(" ")[1];

    // 2. Verify token
    let decoded;
    try {
        decoded = jwt.verify(token, SECRET_KEY);
        return decoded;
    } catch (err) {
        res.writeHead(403, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Invalid or expired token" }));
    }
}


module.exports = verify_token