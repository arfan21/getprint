const mitra = require("../../handlers/mitra/");

module.exports = async (req, res) => {
    const id = req.params.id;

    try {
        const deletedMitra = await mitra.deleteMitra(id);

        return res.json({
            status: true,
            message: deletedMitra,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            status: false,
            message: "Failed to delete mitra",
            error: error,
        });
    }
};
