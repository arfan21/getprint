const axios = require("axios");
const { LINE_CHANNEL_ID } = process.env;
const { LINE_ACCESS_TOKEN } = process.env;
const { LINE_CHANNEL_SECRET } = process.env;

const authLineIdToken = async (req, res, next) => {
    const authHeader = req.headers["authorization"];

    const token = authHeader && authHeader.split(" ")[1];
    const data = `id_token=${token}&client_id=${LINE_CHANNEL_ID}`;

    try {
        const decoded = await axios({
            method: "POST",
            url: `https://api.line.me/oauth2/v2.1/verify`,
            data: data,
        });

        req.user = decoded.data;
        next();
    } catch (error) {
        const { status, data } = error.response;
        return res.status(status).json(data);
    }
};

module.exports = authLineIdToken;
