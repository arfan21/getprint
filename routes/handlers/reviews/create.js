const Review = require("../../../models/Reviews");
const Mitra = require("../../../models/Mitra");
const mongoose = require("mongoose");

module.exports = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(data.mitra_id)) {
                reject("mitra id invalid");
                return;
            }

            const mitra = await Mitra.findById(data.mitra_id);

            if (!mitra) {
                reject("mitra not found");
                return;
            }

            const newReview = new Review(data);
            const savedReview = await newReview.save();
            resolve(savedReview);
        } catch (error) {
            reject(error);
        }
    });
};
