const mitra = require("../../handlers/mitra/");

module.exports = async (req, res) => {
    try {
        const data = req.body;
        data["user_id"] = req.user.sub;
        const newMitra = await mitra.create(data);

        return res.json({
            status: true,
            message: "Success added Mitra",
            data: newMitra,
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: "Failed added Mitra",
            error: error,
        });
    }
};
