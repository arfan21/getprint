const review = require("../../handlers/reviews/");

module.exports = async (req, res) => {
    try {
        req.body["user_id"] = req.user.sub;
        const data = await review.create(req.body);
        return res.json({
            status: true,
            data: data,
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: error,
        });
    }
};
