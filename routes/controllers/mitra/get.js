const mitra = require("../../handlers/mitra/");

module.exports = async (req, res) => {
    try {
        const id = req.params.id;

        const dataMitra = await mitra.get(id);

        if (dataMitra.length == 0) {
            return res.status(404).json({
                status: false,
                message: "failed get mitra",
                error: "Mitra not found",
            });
        }

        return res.status(200).json({
            status: true,
            message: "Success get mitra",
            data: dataMitra,
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: "failed get mitra",
            error: error.data,
        });
    }
};
