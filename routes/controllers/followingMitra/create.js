const followingMitra = require("../../handlers/followingMitra/");

module.exports = async (req, res) => {
    try {
        req.body["user_id"] = req.user.sub;

        const newFollowingMitra = await followingMitra.create(req.body);

        res.json({
            status: true,
            message: "Success following mitra!",
            data: newFollowingMitra,
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: "Failed follow mitra",
            error: error,
        });
    }
};
