const mitra = require("../../handlers/mitra/");

module.exports = async (req, res) => {
    try {
        const id = req.params.id;

        const updatedMitra = await mitra.update(id, req.body);
        return res.json({
            status: true,
            message: "Success update mitra",
            data: updatedMitra,
        });
    } catch (error) {
        if (error === "Mitra not found") {
            return res.status(404).json({
                status: false,
                message: "Failed update mitra",
                error: error,
            });
        }
        return res.status(400).json({
            status: false,
            message: "Failed update mitra",
            error: error,
        });
    }
};
