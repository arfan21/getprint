const FotoMitra = require("../../models/FotoMitra");
const uploadImgur = require("./IMGUR_API/uploadImgur");
const deleteFotoImgur = require("./IMGUR_API/deleteFotoImgur");

const saveFotoMitra = (file) => {
    return new Promise(async (resolve, reject) => {
        const fotoFromImgur = await uploadImgur(file)
            .then((result) => {
                return {
                    success: true,
                    result: result,
                };
            })
            .catch((err) => {
                return {
                    success: false,
                    error: err,
                };
            });

        if (!fotoFromImgur.success) {
            reject({
                success: false,
                data: fotoFromImgur.error,
            });
            return;
        }

        const linkFoto = fotoFromImgur.result.data.link;
        const deleteHashFoto = fotoFromImgur.result.data.deletehash;

        const newFotoMitra = new FotoMitra({
            link_foto: linkFoto,
            deleteHash_foto: deleteHashFoto,
        });
        newFotoMitra
            .save()
            .then((data) => {
                resolve({
                    success: true,
                    data: data,
                });
            })
            .catch((err) => {
                reject({
                    success: false,
                    data: err,
                });
            });
    });
};

const getFotoMitra = (id) => {
    return new Promise((resolve, reject) => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            reject({
                success: false,
                data: "Id foto invalid",
            });
            return;
        }

        FotoMitra.findById(id)
            .then((data) => {
                resolve({
                    success: true,
                    data: data,
                });
            })
            .catch((err) => {
                reject({
                    success: false,
                    data: err,
                });
            });
    });
};

const editFotoMitra = (id, file) => {
    return new Promise(async (resolve, reject) => {
        const fotoFromImgur = await uploadImgur(file)
            .then((result) => {
                return {
                    success: true,
                    result: result,
                };
            })
            .catch((err) => {
                return {
                    success: false,
                    error: err,
                };
            });

        if (!fotoFromImgur.success) {
            reject({
                success: false,
                data: fotoFromImgur.error,
            });
            return;
        }

        const newFotoMitra = {
            link_foto: fotoFromImgur.result.data.link,
            deleteHash_foto: fotoFromImgur.result.data.deletehash,
            updated_at: Date.now(),
        };

        FotoMitra.findByIdAndUpdate(id, newFotoMitra)
            .then(async (data) => {
                if (data == null) {
                    data = {
                        deleteHash_foto: newFotoMitra.deleteHash_foto,
                    };
                }

                const deletedFotoImgur = await deleteFotoImgur(
                    data.deleteHash_foto
                )
                    .then((result) => {
                        return {
                            success: true,
                            result: result.data,
                        };
                    })
                    .catch((err) => {
                        return {
                            success: false,
                            error: err,
                        };
                    });

                if (data.deleteHash_foto == newFotoMitra.deleteHash_foto) {
                    reject({
                        success: false,
                        data: "Foto not found",
                    });
                    return;
                }

                resolve({
                    success: true,
                    data: newFotoMitra,
                });
            })
            .catch((err) => {
                reject({
                    success: false,
                    data: err.message,
                });
            });
    });
};

const deleteFoto = async (id, deletehash) => {
    return new Promise(async (resolve, reject) => {
        const deletedFotoImgur = await deleteFotoImgur(deletehash)
            .then((result) => {
                return {
                    success: true,
                    result: result.data,
                };
            })
            .catch((err) => {
                return {
                    success: false,
                    error: err,
                };
            });

        if (!deletedFotoImgur.success) {
            reject({
                success: false,
                data: deletedFotoImgur.error,
            });
            return;
        }

        FotoMitra.findByIdAndDelete(id, (err, res) => {
            if (err) {
                reject({
                    success: false,
                    data: err,
                });
                return;
            }
            resolve({
                success: true,
                data: res,
            });
        });
    });
};

module.exports = {
    saveFotoMitra: saveFotoMitra,
    getFotoMitra: getFotoMitra,
    editFotoMitra: editFotoMitra,
    deleteFoto: deleteFoto,
};
