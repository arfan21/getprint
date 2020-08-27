const pesanan = require("../pesanan/");
const { LineClient } = require("messaging-api-line");
const mongoose = require("mongoose");
const { LINE_ACCESS_TOKEN } = process.env;
const { LINE_CHANNEL_SECRET } = process.env;
const template = require("./templatePesanan");

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

module.exports = async function sendPesananToLine(idpesanan) {
    const match = {
        _id: mongoose.Types.ObjectId(idpesanan),
    };
    const data = await pesanan.get(match);

    const waktu = new Date(data[0].created_at);
    const tanggal =
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

    const nohp = data[0].mitra.no_hp.replace("0", "62");

    template.body.contents[0].text = data[0].mitra.nama_toko;
    template.body.contents[1].text = data[0].mitra.alamat_toko;
    template.footer.contents[0].contents[1].text = data[0].nama_pemesan;
    template.footer.contents[1].contents[1].text =
        data[0].lokasi.alamat_pemesan;
    template.footer.contents[2].contents[1].text = tanggal;
    template.footer.contents[3].contents[0].action.uri = `https://api.whatsapp.com/send?phone=${nohp}`;

    await client.pushFlex(data[0].user_id, "pesanan", template);
};
