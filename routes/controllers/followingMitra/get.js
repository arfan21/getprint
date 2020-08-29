const followingMitra = require("../../handlers/followingMitra/");
const mongoose = require("mongoose");

module.exports = async (req, res) => {
    const match = {};
    const queryId = req.query.id;
    const queryUserId = req.query.user_id;
    const userId = req.user.sub;

    if (queryId) {
        if (!mongoose.Types.ObjectId.isValid(queryId)) {
            return res.status(400).json({
                status: false,
                message: "Invalid request",
                error: "invalid ID",
            });
        }

        match["_id"] = mongoose.Types.ObjectId(queryId);
    }

    if (queryUserId && queryUserId === userId) {
        match["user_id"] = userId;
    }

    if (!req.query) {
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
