const files = require("../../handlers/files/");
const pesanan = require("../../handlers/pesanan/");
const sendPesananToLine = require("../../handlers/LINE/line");
const mongoose = require("mongoose");

module.exports = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedFile = await files.delete(id);

        return res.status(200).json({
            status: true,
            message: deletedFile,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            status: false,
            message: "Failed to delete file",
            error: error,
        });
    }
};
