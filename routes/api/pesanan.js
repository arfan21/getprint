const express = require("express");
const router = express.Router();
const Pesanan = require("../../models/Pesanan");
const mongoose = require("mongoose");
const sendPesananToLine = require("../LINE/line.js");

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
        delivery: data.delivery,
    });

    newPesanan.save(async (err, data) => {
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
        await sendPesananToLine(data._id);
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
            return res.status(200).json({
                status: true,
                message: "succes get pesanan",
                pesanan: data,
            });
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
            return res.status(200).json({
                status: true,
                message: "succes get pesanan",
                pesanan: data,
            });
        }
    });
});

module.exports = router;
