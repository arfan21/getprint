const Mitra = require("../../../models/Mitra");
const FollowingMitra = require("../../../models/FollowingMitra");
const Review = require("../../../models/Reviews");
const fotoMitra = require("../fotoMitra/");
const pesanan = require("../pesanan/");
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
            ]);

            if (data[0].fotoMitra) {
                const foto_id = data[0].fotomitra[0]._id;
                //delete foto mitra yang akan di delete
                const deletedFoto = await fotoMitra.deleteFoto(foto_id);
            }

            //delete following mitra yang berhubungan dengan mitra yang akan di delete
            FollowingMitra.deleteMany({ mitra_id: id }).exec();
            //delete review yang berhubungan dengan mitra yang akan di delete
            Review.deleteMany({ mitra_id: id }).exec();
            //delete pesanan dan files yang berhubungan dengan mitra yang akan di delete
            const deletedPesanan = await pesanan.whenMitraOnDelete(id);
            //delete mitranya
            const deletedMitra = Mitra.deleteOne({ _id: id }).exec();

            resolve("success delete mitra");
        } catch (error) {
            reject(error);
        }
    });
};
