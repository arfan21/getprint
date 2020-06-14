const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const FotoMitra = require("../../models/FotoMitra");
const request = require("request");
const fs = require("fs");

const IMGUR_CLIENT_ID = "Client-ID f4a9a61acd375d4";

const storage = multer.diskStorage({
    destination: path.join(__dirname + "./../../public/assets"),
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});

const upload = multer({ storage: storage }).single("mitraFoto");

router.post("/uploadfotomitra", upload, (req, res) => {
    let file = req.file;
    let filename = file.filename;

    request(
        {
            method: "POST",
            url: "https://api.imgur.com/3/image",
            headers: {
                Authorization: IMGUR_CLIENT_ID,
            },
            body: fs.readFileSync(
                path.join(__dirname + "./../../public/assets/" + filename)
            ),
        },
        (err, response, body) => {
            let resJson = JSON.parse(body);

            const newFotoMitra = new FotoMitra({
                link_foto: resJson.data.link,
                deleteHash_foto: resJson.data.deletehash,
            });

            newFotoMitra.save((err, data) => {
                if (err) {
                    console.log(err);
                    return res.json({
                        status: false,
                        message: "Failed to upload foto mitra",
                    });
                } else {
                    console.log({
                        status: true,
                        message: "Success to upload foto mitra",
                        data: data,
                    });
                    return res.status(200).json({
                        status: true,
                        message: "Success to upload foto mitra",
                        data: data,
                    });
                }
            });
        }
    );
});

router.put("/uploadfotomitra/:id", upload, (req, res) => {
    const id = req.params.id;
    let file = req.file;
    let filename = file.filename;

    FotoMitra.findById(id).exec((err, data) => {
        request({
            method: "DELETE",
            url: "https://api.imgur.com/3/image/" + data.deleteHash_foto,
            headers: {
                Authorization: IMGUR_CLIENT_ID,
            },
        });
    });

    request(
        {
            method: "POST",
            url: "https://api.imgur.com/3/image",
            headers: {
                Authorization: IMGUR_CLIENT_ID,
            },
            body: fs.readFileSync(
                path.join(__dirname + "./../../public/assets/" + filename)
            ),
        },
        (err, response, body) => {
            let resJson = JSON.parse(body);
            const newFotoMitra = {
                link_foto: resJson.data.link,
                deleteHash_foto: resJson.data.deletehash,
            };

            FotoMitra.findByIdAndUpdate(id, newFotoMitra, (err, data) => {
                if (err) {
                    res.json({
                        status: false,
                        message: "Failed update foto mitra",
                        error: err,
                    });
                    return;
                }
                res.status(200).json({
                    status: true,
                    message: "Success update foto mitra",
                    fotomitra: newFotoMitra,
                });
            });
        }
    );
});

module.exports = router;
