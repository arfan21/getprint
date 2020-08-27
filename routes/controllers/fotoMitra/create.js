const fotoMitra = require("../../handlers/fotoMitra/");

module.exports = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({
                status: false,
                message: "Failed to upload foto",
                error: "foto required",
            });
        }
        const newFotoMitra = await fotoMitra.create(file, req.body);

        return res.json({
            status: true,
            message: "Success to upload foto mitra",
            data: newFotoMitra,
        });
    } catch (error) {
        if (error === "mitra not found") {
            return res.status(404).json({
                status: false,
                message: error,
            });
        }
        return res.status(400).json({
            status: false,
            message: error,
        });
    }
};
