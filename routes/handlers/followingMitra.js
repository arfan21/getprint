const mongoose = require("mongoose");
const FollowingMitra = require("../../models/FollowingMitra");

const saveFollowingMitra = (data) => {
    return new Promise((resolve, reject) => {
        const NewFollowingmitra = new FollowingMitra({
            userid_line: data.userid_line,
            id_toko: data.id_toko,
        });
        NewFollowingmitra.save()
            .then((data) => {
                resolve({
                    success: true,
                    data: data,
                });
            })
            .catch((err) => {
                reject({
                    success: false,
                    data: err.message,
                });
            });
    });
};

const getFollowingMitras = (match) => {
    return new Promise((resolve, reject) => {
        FollowingMitra.aggregate([
            { $match: match },
            {
                $lookup: {
                    from: "mitras",
                    localField: "id_toko",
                    foreignField: "_id",
                    as: "toko",
                },
            },
        ])
            .then((data) => {
                resolve({
                    success: true,
                    data: data,
                });
            })
            .catch((err) => {
                reject({
                    success: false,
                    data: err.errmsg,
                });
            });
    });
};

const deleteFollowingMitra = (id) => {
    return new Promise(async (resolve, reject) => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            reject({
                success: false,
                data: "Id following mitra invalid",
            });
            return;
        }

        FollowingMitra.findByIdAndDelete(id, (err, data) => {
            if (err) {
                reject({
                    success: false,
                    data: err,
                });
                return;
            }

            resolve({
                success: true,
                data: data,
            });
        });
    });
};

module.exports = {
    saveFollowingMitra: saveFollowingMitra,
    getFollowingMitras: getFollowingMitras,
    deleteFollowingMitra: deleteFollowingMitra,
};
