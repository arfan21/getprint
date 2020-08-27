const pesanan = require("../../handlers/pesanan/");

module.exports = async (req, res) => {
    try {
        req.body["user_id"] = req.user.sub;
        const dataPesanan = await pesanan.create(req.body);

        return res.json({
            status: true,
            message: "Success added Pesanan",
            data: dataPesanan,
        });
    } catch (error) {
        if (error === "mitra not found") {
            return res.status(404).json({
                status: false,
                message: "Failed to save data pesanan",
                error: error,
            });
        }
        return res.status(400).json({
            status: false,
            message: "Failed to save data pesanan",
            error: error,
        });
    }
};
