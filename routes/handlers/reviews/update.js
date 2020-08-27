const Review = require("../../../models/Reviews");
const mongoose = require("mongoose");

module.exports = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                reject("review id invalid");
                return;
            }

            data["updated_at"] = Date.now();

            const updatedReview = await Review.findByIdAndUpdate(id, data, {
                new: true,
                runValidators: true,
                context: "query",
            });
            resolve(updatedReview);
        } catch (error) {
            reject(error);
        }
    });
};
