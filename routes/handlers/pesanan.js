const Pesanan = require("../../models/Pesanan");

const savePesanan = (data) => {
    return new Promise((resolve, reject) => {
        const newPesanan = new Pesanan({
            userid_line: data.userid_line,
            id_toko: data.id_toko,
            id_file: data.id_file,
            nama_pemesan: data.nama,
            nohp_pemesan: data.nohp_pemesan,
            jenis_pesanan: data.jenispesanan,
            lokasi: {
                alamat_pemesan: data.lokasi.alamat_pemesan,
                lat: data.lokasi.lat,
                lng: data.lokasi.lng,
            },
            delivery: data.delivery,
        });

        newPesanan
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

const getPesanan = (match) => {
    return new Promise((resolve, reject) => {
        Pesanan.aggregate([
            { $sort: { added: -1 } },
            { $match: match },
            {
                $lookup: {
                    from: "mitras",
                    localField: "id_toko",
                    foreignField: "_id",
                    as: "toko",
                },
            },
            {
                $lookup: {
                    from: "files",
                    localField: "id_file",
                    foreignField: "_id",
                    as: "files",
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

module.exports = {
    savePesanan: savePesanan,
    getPesanan: getPesanan,
};
