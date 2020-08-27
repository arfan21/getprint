const review = require("../../handlers/reviews/");

module.exports = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await review.update(id, req.body);
        return res.json({
            status: true,
            message: "success update review",
            data: data,
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: "failed update review",
            data: error,
        });
    }
};
