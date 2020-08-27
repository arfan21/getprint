const Mitra = require("../../../models/Mitra");
const mongoose = require("mongoose");

module.exports = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                reject("mitra id invalid");
                return;
            }

            const data = await Mitra.aggregate([
                { $match: { _id: mongoose.Types.ObjectId(id) } },
                {
                    $lookup: {
                        from: "fotomitras",
                        localField: "_id",
                        foreignField: "mitra_id",
                        as: "fotomitra",
                    },
                },
                {
                    $unwind: {
                        path: "$mitra",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: "reviews",
                        localField: "_id",
                        foreignField: "mitra_id",
                        as: "rating.user_rating",
                    },
                },
            ]);

            //menghitung total rating, total point, dan avg point
            for (i = 0; i < data.length; i++) {
                const userRating = data[i].rating.user_rating;
                data[i].rating["total_rating"] = userRating.length;

                let total_point = 0;

                for (j = 0; j < userRating.length; j++) {
                    total_point = total_point + userRating[j].rating_user;
                }

                data[i].rating["total_point"] = total_point;
                data[i].rating["avg_point"] =
                    total_point === 0 ? 0 : total_point / userRating.length;
            }

            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
};
