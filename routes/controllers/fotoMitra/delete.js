const fotoMitra = require("../../handlers/fotoMitra/");

module.exports = async (req, res) => {
    try {
        const id = req.params.id;

        const deletedFoto = await fotoMitra.deleteFoto(id);

        return res.status(200).json({
            status: true,
            message: deletedFoto,
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: "Failed to delete foto mitra",
            error: error,
        });
    }
};
