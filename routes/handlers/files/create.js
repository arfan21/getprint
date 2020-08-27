const Files = require("../../../models/Files");
const Pesanan = require("../../../models/Pesanan");
const uploadDropbox = require("../DROPBOX_API/uploadDropbox");
const getSharedLink = require("../DROPBOX_API/getSharedLink");
const mongoose = require("mongoose");

module.exports = (files, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(data.pesanan_id)) {
                reject("pesanan id invalid");
                return;
            }

            const pesanan = await Pesanan.findById(data.pesanan_id);

            if (!pesanan) {
                return reject("pesanan not found");
            }

            for (i = 0; i < files.length; i++) {
                let file = files[i];

                const fileFromDropBox = await uploadDropbox(file);

                const path_display = fileFromDropBox.path_display;

                const sharedLink = await getSharedLink(path_display);

                const newUpload = new Files({
                    pesanan_id: data.pesanan_id,
                    link_file: sharedLink.url,
                    path: path_display,
                });

                const fileUploaded = newUpload.save();
            }

            resolve("success upload files");
        } catch (error) {
            reject(error);
        }
    });
};
