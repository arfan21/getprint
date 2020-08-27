const mitra = require("../../handlers/mitra/");

module.exports = async (req, res) => {
    const sort = {};
    const match = {};
    match["status"] = "active";
    if (req.query.sort) {
        if (req.query.sort == "rating") {
            sort["rating.avg_point"] = -1;
        } else {
            sort[req.query.sort] = -1;
        }
    } else {
        sort["created_at"] = 1;
    }

    try {
        const dataMitra = await mitra.getAll(sort, match);

        if (dataMitra.length == 0) {
            return res.status(404).json({
                status: false,
                message: "failed get mitra",
                error: "Mitra not found",
            });
        }

        return res.json({
            status: true,
            message: "Success get mitra",
            data: dataMitra,
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: "failed get mitra",
            error: error,
        });
    }
};
