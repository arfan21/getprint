const Mitra = require("../../../models/Mitra");

module.exports = (sort, match) => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await Mitra.aggregate([
                { $match: match },
                { $sort: sort },
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

            if (Object.keys(sort)[0] === "rating.avg_point") {
                data.sort((a, b) => {
                    return b.rating.avg_point - a.rating.avg_point;
                });
            }

            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
};
