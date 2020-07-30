const axios = require("axios");
const { LINE_CHANNEL_ID } = process.env;
const { LINE_ACCESS_TOKEN } = process.env;
const { LINE_CHANNEL_SECRET } = process.env;

const authLineIdToken = async (req, res, next) => {
    const dataBody = req.body;
    const authHeader = req.headers["authorization"];

    const token = authHeader && authHeader.split(" ")[1];
    const data = `id_token=${token}&client_id=${LINE_CHANNEL_ID}`;

    await axios({
        method: "POST",
        url: `https://api.line.me/oauth2/v2.1/verify`,
        data: data,
    })
        .then((result) => {
            let idFromJWT = result.data.sub;

            if (idFromJWT == req.query.userid_line) {
                return next();
            }

            if (idFromJWT != dataBody.userid_line) {
                console.log("user id LINE not exist");
                return res.status(401).json({
                    status: false,
                    message: "Unauthorized",
                });
            }

            next();
        })
        .catch((error) => {
            console.log(error.response.data);
            return res.status(401).json({
                status: false,
                message: error.response.data.error_description,
            });
        });
};

module.exports = authLineIdToken;
