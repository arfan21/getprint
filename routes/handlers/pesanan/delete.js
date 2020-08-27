const Pesanan = require("../../../models/Pesanan");
const file = require("../files");
const mongoose = require("mongoose");

module.exports = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                reject("pesanan id invalid");
                return;
            }

            const data = await Pesanan.aggregate([
                { $match: { _id: mongoose.Types.ObjectId(id) } },
                {
                    $lookup: {
                        from: "files",
                        localField: "_id",
                        foreignField: "pesanan_id",
                        as: "files",
                    },
                },
            ]);

            const listIds = data.map((d) => {
                return { pesanan_id: d._id, files: d.files };
            });

            const fileIds = [
                ...new Set(
                    [].concat(...listIds.map((o) => o.files.map((z) => z._id)))
                ),
            ];

            const pesananIds = listIds.map((d) => d.pesanan_id);

            fileIds.forEach(async (id) => {
                const deletedFile = await file.delete(id);
            });

            const deletedPesanan = await Pesanan.deleteOne({
                _id: pesananIds,
            });

            resolve("success delete pesanan");
        } catch (error) {
            reject(error);
        }
    });
};
