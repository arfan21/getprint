const Review = require("../../../models/Reviews");
const mongoose = require("mongoose");

module.exports = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                reject("review id invalid");
                return;
            }

            const deletedReview = await Review.findByIdAndDelete(id);
            resolve("success delete review");
        } catch (error) {
            reject(error);
        }
    });
};
