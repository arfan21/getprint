const mongoose = require("mongoose");
const FollowingMitra = require("../../../models/FollowingMitra");
const Mitra = require("../../../models/Mitra");

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

            const NewFollowingmitra = new FollowingMitra(data);
            const followingSaved = await NewFollowingmitra.save();

            resolve(followingSaved);
        } catch (error) {
            reject(error);
        }
    });
};
