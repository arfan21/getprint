const Pesanan = require("../../../models/Pesanan");
const Mitra = require("../../../models/Mitra");
const file = require("../files");
const mongoose = require("mongoose");

module.exports = (mitra_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const mitra = await Mitra.findById(mitra_id);
            if (!mitra) {
                reject("mitra not found");
                return;
            }

            const idList = await Pesanan.aggregate([
                { $match: { mitra_id: mongoose.Types.ObjectId(mitra_id) } },
                {
                    $lookup: {
                        from: "files",
                        localField: "_id",
                        foreignField: "pesanan_id",
                        as: "files",
                    },
                },
            ]);

            const list = idList.map((d) => {
                return { pesanan_id: d._id, files: d.files };
            });

            const fileIds = [
                ...new Set(
                    [].concat(...list.map((o) => o.files.map((z) => z._id)))
                ),
            ];

            const pesananIds = list.map((d) => d.pesanan_id);

            fileIds.forEach(async (id) => {
                const deletedFile = await file.delete(id);
            });

            const deletedPesanan = await Pesanan.deleteMany({
                _id: { $in: pesananIds },
            });
            resolve("success delete pesanan and files");
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};
