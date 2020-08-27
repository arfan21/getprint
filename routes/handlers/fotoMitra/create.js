const FotoMitra = require("../../../models/FotoMitra");
const Mitra = require("../../../models/Mitra");
const uploadImgur = require("../IMGUR_API/uploadImgur");
const mongoose = require("mongoose");

module.exports = (file, data) => {
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

            const fotoFromImgur = await uploadImgur(file);

            const linkFoto = fotoFromImgur.data.link;
            const deleteHashFoto = fotoFromImgur.data.deletehash;

            const newFotoMitra = new FotoMitra({
                mitra_id: data.mitra_id,
                link_foto: linkFoto,
                deleteHash_foto: deleteHashFoto,
            });

            const uploadedFoto = newFotoMitra.save();
            resolve(uploadedFoto);
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};
