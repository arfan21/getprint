const pesanan = require("../../handlers/pesanan/");

module.exports = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedPesanan = await pesanan.delete(id);

        res.json({
            success: true,
            message: deletedPesanan,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "failed to delete pesanan",
            error: error,
        });
    }
};
