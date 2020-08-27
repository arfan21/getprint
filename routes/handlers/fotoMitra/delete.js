const FotoMitra = require("../../../models/FotoMitra");
const mongoose = require("mongoose");
const deleteFotoImgur = require("../IMGUR_API/deleteFotoImgur");

module.exports = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                reject("id foto invalid");
                return;
            }

            const deletedFoto = await FotoMitra.findByIdAndDelete(id);

            await deleteFotoImgur(deletedFoto.deleteHash_foto);

            resolve("success delete foto");
        } catch (error) {
            reject(error);
        }
    });
};
