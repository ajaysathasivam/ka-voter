const jwt = require("jsonwebtoken");
const json = require("../utils/json");

async function verifyUser(req, res) {
    try {
        const chunks = [];
        for await (const chunk of req) chunks.push(chunk);
        const body = JSON.parse(Buffer.concat(chunks).toString());

        const { token } = body;
        console.log(token, "totke")
        if (!token) return json(res, 401, { success: false, message: "Token missing" });

        let payload;
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return json(res, 401, { success: false, message: "Invalid token" });
        }

        // Optionally, fetch user info from DB here
        return json(res, 200, { success: true, username: payload.username });

    } catch (err) {
        console.error("verifyUser error:", err);
        return json(res, 500, { success: false, message: "Internal Server Error" });
    }
}

module.exports = { verifyUser };
