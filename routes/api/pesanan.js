const express = require("express");
const router = express.Router();
const Pesanan = require("../../models/Pesanan");
const mongoose = require("mongoose");
const { LineClient } = require("messaging-api-line");
const LINE_ACCESS_TOKEN = token;
const LINE_CHANNEL_SECRET = token;

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

function sendToLine(idpesanan) {
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
    var waktu = new Date(data[0].added);
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
            text: data[0].alamat_pemesan,
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
}

router.post("/pesanan", (req, res) => {
  let data = req.body;

  const newPesanan = new Pesanan({
    userid_line: data.userid_line,
    id_toko: data.id_toko,
    nama_pemesan: data.nama,
    nohp_pemesan: data.nohp_pemesan,
    jenis_pesanan: data.jenispesanan,
    alamat_pemesan: data.alamat_pemesan,
    id_file: data.id_file,
  });

  newPesanan.save((err, data) => {
    if (err) {
      console.log({
        status: false,
        message: "Pesanan gagal, cek lagi data yang dimasukkan!",
        error: err,
      });
      return res.json({
        status: false,
        message: "Pesanan gagal, cek lagi data yang dimasukkan!",
        error: err,
      });
    }
    console.log({
      status: true,
      message: "Success added Pesanan",
      pesanan: data,
    });
    //mengirim data pesanan ke line pemesan
    sendToLine(data._id);

    return res.json({
      status: true,
      message: "Success added Pesanan",
      pesanan: data,
    });
  });
});

router.get("/pesanan/:lineid", (req, res) => {
  const lineid = req.params.lineid;

  Pesanan.aggregate([
    { $sort: { added: -1 } },
    { $match: { userid_line: lineid } },
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
    if (err) {
      return res.json({
        status: false,
        message: "failed get pesanan",
        error: err,
      });
    } else if (data.length == 0) {
      return res.json({
        status: false,
        message: "failed get pesanan",
        error: "pesanan not found",
      });
    } else {
      return res
        .status(200)
        .json({ status: true, message: "succes get pesanan", pesanan: data });
    }
  });
});

router.get("/pesanan/byid/:id", (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.json({
      status: false,
      message: "failed get pesanan",
      error: "Id Pesanan invalid",
    });
  }

  Pesanan.aggregate([
    { $sort: { added: -1 } },
    { $match: { _id: mongoose.Types.ObjectId(id) } },
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
    if (err) {
      return res.json({
        status: false,
        message: "failed get pesanan",
        error: err,
      });
    } else if (data.length == 0) {
      return res.json({
        status: false,
        message: "failed get pesanan",
        error: "pesanan not found",
      });
    } else {
      return res
        .status(200)
        .json({ status: true, message: "succes get pesanan", pesanan: data });
    }
  });
});

module.exports = router;
