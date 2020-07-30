const Mitra = require("../../models/Mitra");
const mongoose = require("mongoose");

const saveMitra = (data) => {
    return new Promise((resolve, reject) => {
        const newMitra = new Mitra({
            id_foto: data.id_foto,
            userid_line_pemilik: data.userid_line,
            nama_toko: data.nama_toko,
            nama_pemilik: data.nama_pemilik,
            email: data.email,
            no_hp: data.no_hp,
            harga: {
                print: data.harga.print,
                scan: data.harga.scan,
                fotocopy: data.harga.fotocopy,
            },
            coords: {
                lat: data.coords.lat,
                lng: data.coords.lng,
            },
            alamat_toko: data.alamat_toko,
        });
        newMitra
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
                    data: err.message,
                });
            });
    });
};

const getAllMitras = (sort) => {
    return new Promise((resolve, reject) => {
        Mitra.aggregate([
            { $match: { status: "active" } },
            { $sort: sort },
            {
                $lookup: {
                    from: "fotomitras",
                    localField: "id_foto",
                    foreignField: "_id",
                    as: "fotomitra",
                },
            },
        ])
            .then((data) => {
                resolve({
                    success: true,
                    data: data,
                });
            })
            .catch((err) => {
                reject({
                    success: false,
                    data: err.errmsg,
                });
            });
    });
};

const getAllMitrasInactive = (sort) => {
    return new Promise((resolve, reject) => {
        Mitra.aggregate([
            { $match: { status: "inactive" } },
            { $sort: sort },
            {
                $lookup: {
                    from: "fotomitras",
                    localField: "id_foto",
                    foreignField: "_id",
                    as: "fotomitra",
                },
            },
        ])
            .then((data) => {
                resolve({
                    success: true,
                    data: data,
                });
            })
            .catch((err) => {
                reject({
                    success: false,
                    data: err.errmsg,
                });
            });
    });
};

const getMitra = (id) => {
    return new Promise((resolve, reject) => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            reject({
                success: false,
                data: "Id Mitra invalid",
            });
            return;
        }

        Mitra.aggregate([
            { $match: { _id: mongoose.Types.ObjectId(id) } },
            {
                $lookup: {
                    from: "fotomitras",
                    localField: "id_foto",
                    foreignField: "_id",
                    as: "fotomitra",
                },
            },
        ])
            .then((data) => {
                resolve({
                    success: true,
                    data: data,
                });
            })
            .catch((err) => {
                reject({
                    success: false,
                    data: err.errmsg,
                });
            });
    });
};

const editMitra = (id, data) => {
    return new Promise((resolve, reject) => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            reject({
                success: false,
                data: "Id Mitra invalid",
            });
            return;
        }
        data["updated_at"] = Date.now();

        Mitra.findByIdAndUpdate(id, data, { new: true })
            .then((data) => {
                resolve({
                    success: true,
                    data: data,
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

const deleteMitra = (id) => {
    return new Promise((resolve, reject) => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            reject({
                success: false,
                data: "Id Mitra invalid",
            });
            return;
        }

        Mitra.findByIdAndDelete(id, (err) => {
            if (err) {
                reject({
                    success: false,
                    data: err,
                });
                return;
            }
            resolve({
                success: true,
                data: "Success delete mitra",
            });
        });
    });
};

module.exports = {
    saveMitra: saveMitra,
    getAllMitras: getAllMitras,
    getAllMitrasInactive: getAllMitrasInactive,
    getMitra: getMitra,
    editMitra: editMitra,
    deleteMitra: deleteMitra,
};
