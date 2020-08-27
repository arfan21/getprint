const Files = require("../../../models/Files");
const mongoose = require("mongoose");
const deleteDropbox = require("../DROPBOX_API/deleteDropbox");

module.exports = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                reject("files id invalid");
                return;
            }

            const deletedFile = await Files.findByIdAndDelete(id);

            const deletedDropbox = await deleteDropbox(deletedFile.path);

            resolve("success delete file");
        } catch (error) {
            reject(error);
        }
    });
};
