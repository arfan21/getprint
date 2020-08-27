const followingMitra = require("../../handlers/followingMitra/");

module.exports = async (req, res) => {
    try {
        const id = req.params.id;

        const deletedFollow = await followingMitra.delete(id);

        return res.json({
            status: true,
            message: "Success delete data following mitra",
            data: deletedFollow,
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: "Failed delete data following mitra",
            error: error,
        });
    }
};
