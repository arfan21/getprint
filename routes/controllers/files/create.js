const files = require("../../handlers/files/");
const pesanan = require("../../handlers/pesanan/");
const sendPesananToLine = require("../../handlers/LINE/line");
const mongoose = require("mongoose");

module.exports = async (req, res) => {
    try {
        if (!req.files) {
            return res.status(400).json({
                status: false,
                message: "Failed to upload file",
                error: "files required",
            });
        }
        const dataFile = await files.create(req.files, req.body);

        await sendPesananToLine(req.body.pesanan_id);

        const match = {
            _id: mongoose.Types.ObjectId(req.body.pesanan_id),
        };

        const dataPesanan = await pesanan.get(match);
        return res.status(200).json({
            status: true,
            message: "Success to upload file",
            data: dataPesanan,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            status: false,
            message: "Failed to upload file",
            error: error,
        });
    }
};
