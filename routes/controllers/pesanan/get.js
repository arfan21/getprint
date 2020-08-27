const pesanan = require("../../handlers/pesanan/");
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
        if (req.query.user_id) {
            match[req.query.match] = req.query.user_id;
        } else {
            return res.status(400).json({
                status: false,
                message: "Invalid request",
                error: "not match query",
            });
        }
    } else {
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
