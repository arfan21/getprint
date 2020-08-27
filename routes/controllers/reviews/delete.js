const review = require("../../handlers/reviews/");

module.exports = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await review.deleteReview(id);
        return res.json({
            status: true,
            message: data,
        });
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: error,
        });
    }
};
