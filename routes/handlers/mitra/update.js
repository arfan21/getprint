const Mitra = require("../../../models/Mitra");
const mongoose = require("mongoose");

module.exports = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                reject("Id Mitra invalid");
                return;
            }

            data["updated_at"] = Date.now();

            const updatedMitra = await Mitra.findByIdAndUpdate(id, data, {
                new: true,
                runValidators: true,
                context: "query",
            });

            if (!updatedMitra) {
                reject("Mitra not found");
            }
            resolve(updatedMitra);
        } catch (error) {
            reject(error);
        }
    });
};
