const FollowingMitra = require("../../../models/FollowingMitra");
const mongoose = require("mongoose");

module.exports = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                reject("id following mitra invalid");
                return;
            }

            const deleted = FollowingMitra.findByIdAndDelete(id);

            resolve(deleted);
        } catch (error) {
            reject(error);
        }
    });
};
