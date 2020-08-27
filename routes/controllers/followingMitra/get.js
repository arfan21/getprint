const followingMitra = require("../../handlers/followingMitra/");
const mongoose = require("mongoose");

module.exports = async (req, res) => {
    const match = {};

    if (req.query.match == "_id") {
        if (req.query._id) {
            if (!mongoose.Types.ObjectId.isValid(req.query._id)) {
                return res.status(400).json({
                    status: false,
                    message: "Invalid request",
                    error: "invalid ID",
                });
            }
            match[req.query.match] = mongoose.Types.ObjectId(req.query._id);
        } else {
            return res.status(400).json({
                status: false,
                message: "Invalid request",
                error: "not match query",
            });
        }
    } else if (req.query.match == "user_id") {
        match[req.query.match] = req.user.sub;
    } else {
        return res.status(400).json({
            status: false,
            message: "Invalid request",
            error: "there are some missing queries",
        });
    }

    try {
        const dataFollow = await followingMitra.get(match);

        if (dataFollow.length == 0) {
            return res.status(404).json({
                status: false,
                message: "Failed get data following mitra",
                error: "data not found",
            });
        }

        return res.json({
            status: true,
            message: "Success get data following mitra",
            data: dataFollow,
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: "Failed get data following mitra",
            error: error,
        });
    }
};
