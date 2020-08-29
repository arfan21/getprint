const pesanan = require("../../handlers/pesanan/");
const mongoose = require("mongoose");

module.exports = async (req, res) => {
    const match = {};
    const queryId = req.query.id;
    const queryUserId = req.query.user_id;

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

    if (queryUserId) {
        match["user_id"] = queryUserId;
    }

    if (!req.query) {
        return res.status(400).json({
            status: false,
            message: "Invalid request",
            error: "there are some missing queries",
        });
    }

    try {
        const dataPesanan = await pesanan.get(match);

        if (dataPesanan.length == 0) {
            return res.status(404).json({
                status: false,
                message: "failed get pesanan",
                error: "pesanan not found",
            });
        }

        return res.json({
            status: true,
            message: "succes get pesanan",
            data: dataPesanan,
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: "failed get pesanan",
            error: error,
        });
    }
};
