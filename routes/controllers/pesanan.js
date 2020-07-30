const pesanan = require("../handlers/pesanan");
const mongoose = require("mongoose");
const sendPesananToLine = require("../handlers/LINE/line");

const savePesanan = async (req, res) => {
    const dataPesanan = await pesanan
        .savePesanan(req.body)
        .then((result) => {
            return result;
        })
        .catch((err) => {
            return err;
        });

    if (!dataPesanan.success) {
        return res.status(400).json({
            status: false,
            message: "Failed to save data pesanan",
            error: dataPesanan.data,
        });
    }

    await sendPesananToLine(dataPesanan.data._id);

    return res.json({
        status: true,
        message: "Success added Pesanan",
        data: dataPesanan.data,
    });
};

const getPesanan = async (req, res) => {
    const match = {};

    if (req.query.match == "_id") {
        if (req.query.id) {
            if (!mongoose.Types.ObjectId.isValid(req.query.id)) {
                return res.status(400).json({
                    status: false,
                    message: "Invalid request",
                    error: "invalid ID",
                });
            }
            match[req.query.match] = mongoose.Types.ObjectId(req.query.id);
        } else {
            return res.status(400).json({
                status: false,
                message: "Invalid request",
                error: "not match query",
            });
        }
    } else if (req.query.match == "userid_line") {
        if (req.query.userid_line) {
            match[req.query.match] = req.query.userid_line;
        } else {
            return res.status(400).json({
                status: false,
                message: "Invalid request",
                error: "not match query",
            });
        }
    } else {
        return res.status(400).json({
            status: false,
            message: "Invalid request",
            error: "there are some missing queries",
        });
    }

    const dataPesanan = await pesanan
        .getPesanan(match)
        .then((result) => {
            return result;
        })
        .catch((err) => {
            return err;
        });

    if (!dataPesanan.success) {
        return res.status(400).json({
            status: false,
            message: "failed get pesanan",
            error: dataPesanan.data,
        });
    }

    if (dataPesanan.data.length == 0) {
        return res.status(404).json({
            status: false,
            message: "failed get pesanan",
            error: "pesanan not found",
        });
    }

    return res.json({
        status: true,
        message: "succes get pesanan",
        data: dataPesanan.data,
    });
};

module.exports = {
    savePesanan: savePesanan,
    getPesanan: getPesanan,
};
