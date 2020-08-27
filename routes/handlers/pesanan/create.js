const Pesanan = require("../../../models/Pesanan");
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

            const newPesanan = new Pesanan(data);

            const savedPesanan = await newPesanan.save();

            resolve(savedPesanan);
        } catch (error) {
            reject(error);
        }
    });
};
