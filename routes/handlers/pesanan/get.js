const Pesanan = require("../../../models/Pesanan");

module.exports = (match) => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await Pesanan.aggregate([
                { $sort: { added: -1 } },
                { $match: match },
                {
                    $lookup: {
                        from: "files",
                        localField: "_id",
                        foreignField: "pesanan_id",
                        as: "files",
                    },
                },
                {
                    $lookup: {
                        from: "mitras",
                        localField: "mitra_id",
                        foreignField: "_id",
                        as: "mitra",
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
                        from: "fotomitras",
                        localField: "mitra_id",
                        foreignField: "mitra_id",
                        as: "mitra.fotomitra",
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
                        localField: "mitra_id",
                        foreignField: "mitra_id",
                        as: "mitra.rating.user_rating",
                    },
                },
            ]);

            for (i = 0; i < data.length; i++) {
                const mitra = data[i].mitra;

                const userRating = mitra.rating.user_rating;

                mitra.rating["total_rating"] = userRating.length;

                let total_point = 0;

                for (j = 0; j < userRating.length; j++) {
                    total_point = total_point + userRating[j].rating_user;
                }

                mitra.rating["total_point"] = total_point;
                mitra.rating["avg_point"] =
                    total_point === 0 ? 0 : total_point / userRating.length;
            }
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
};
