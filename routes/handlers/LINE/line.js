const Pesanan = require("../../../models/Pesanan");
const { LineClient } = require("messaging-api-line");
const { LINE_ACCESS_TOKEN } = process.env;
const { LINE_CHANNEL_SECRET } = process.env;

// get accessToken and channelSecret from LINE developers website
const client = new LineClient({
    accessToken: LINE_ACCESS_TOKEN,
    channelSecret: LINE_CHANNEL_SECRET,
});

arrbulan = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
];
arrhari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"];

module.exports = function sendPesananToLine(idpesanan) {
    Pesanan.aggregate([
        { $sort: { added: -1 } },
        { $match: { _id: idpesanan } },
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
                from: "uploads",
                localField: "id_file",
                foreignField: "_id",
                as: "file",
            },
        },
    ]).exec((err, data) => {
        var waktu = new Date(data[0].created_at);
        var tanggal =
            arrhari[waktu.getDay()] +
            ", " +
            waktu.getDate() +
            " " +
            arrbulan[waktu.getMonth()] +
            " " +
            waktu.getFullYear() +
            " " +
            waktu.getHours() +
            ":" +
            waktu.getMinutes() +
            ":" +
            waktu.getSeconds();
        client.pushFlex(data[0].userid_line, "pesanan", {
            type: "bubble",
            header: {
                type: "box",
                layout: "vertical",
                contents: [
                    {
                        type: "text",
                        text: "INVOICE",
                        color: "#0029FF",
                        size: "lg",
                        weight: "bold",
                        margin: "none",
                    },
                ],
            },
            body: {
                type: "box",
                layout: "vertical",
                contents: [
                    {
                        type: "text",
                        text: data[0].toko[0].nama_toko,
                        size: "lg",
                        color: "#0029FF",
                        weight: "bold",
                    },
                    {
                        type: "text",
                        text: data[0].toko[0].alamat_toko,
                        color: "#0029FF",
                    },
                ],
            },
            footer: {
                type: "box",
                layout: "vertical",
                contents: [
                    {
                        type: "text",
                        text: "Penerima",
                        color: "#979797",
                    },
                    {
                        type: "text",
                        text: data[0].nama_pemesan,
                    },
                    {
                        type: "text",
                        text: "Alamat Penerima",
                        color: "#979797",
                    },
                    {
                        type: "text",
                        text: data[0].lokasi.alamat_pemesan,
                    },
                    {
                        type: "text",
                        text: "Tanggal",
                        color: "#979797",
                    },
                    {
                        type: "text",
                        text: tanggal,
                    },
                ],
            },
        });
    });
};
