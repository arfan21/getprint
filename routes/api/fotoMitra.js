const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const FotoMitra = require("../../models/FotoMitra");
const uploadImgur = require("../IMGUR_API/uploadImgur");
const deleteFotoImgur = require("../IMGUR_API/deleteFotoImgur");
const authLineIdToken = require("../middleware/middleware");

const upload = multer().single("mitraFoto");

router.post("/uploadfotomitra", upload, authLineIdToken, async (req, res) => {
    let file = req.file;
    const fotoFromImgur = await uploadImgur(file).then(
        (result) => {
            return {
                status: true,
                result: result,
            };
        },
        (err) => {
            return {
                status: false,
                error: err,
            };
        }
    );

    if (!fotoFromImgur.status) {
        console.log(fotoFromImgur.error);
        return res.status(500).json({
            status: false,
            message: fotoFromImgur.error,
        });
    }

    const linkFoto = fotoFromImgur.result.data.link;
    const deleteHashFoto = fotoFromImgur.result.data.deletehash;

    const newFotoMitra = new FotoMitra({
        link_foto: linkFoto,
        deleteHash_foto: deleteHashFoto,
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
});

router.put(
    "/uploadfotomitra/:id",
    upload,
    authLineIdToken,
    async (req, res) => {
        const id = req.params.id;
        let file = req.file;

        await FotoMitra.findById(id).exec(async (err, data) => {
            const deleteFoto = await deleteFotoImgur(data.deleteHash_foto).then(
                (result) => {
                    return {
                        status: true,
                        result: result.data,
                    };
                },
                (err) => {
                    return {
                        status: false,
                        error: err,
                    };
                }
            );
            console.log(deleteFoto);
        });

        const fotoFromImgur = await uploadImgur(file).then(
            (result) => {
                return {
                    status: true,
                    result: result,
                };
            },
            (err) => {
                return {
                    status: false,
                    error: err,
                };
            }
        );

        const linkFoto = fotoFromImgur.result.data.link;
        const deleteHashFoto = fotoFromImgur.result.data.deletehash;

        const newFotoMitra = {
            link_foto: linkFoto,
            deleteHash_foto: deleteHashFoto,
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
            console.log({
                status: true,
                message: "Success update foto mitra",
                fotomitra: newFotoMitra,
            });
            res.status(200).json({
                status: true,
                message: "Success update foto mitra",
                fotomitra: newFotoMitra,
            });
        });
    }
);

router.delete("/uploadfotomitra/:id", authLineIdToken, async (req, res) => {
    const id = req.params.id;

    await FotoMitra.findById(id).exec(async (err, data) => {
        const deleteFoto = await deleteFotoImgur(data.deleteHash_foto).then(
            (result) => {
                return {
                    status: true,
                    result: result.data,
                };
            },
            (err) => {
                return {
                    status: false,
                    error: err,
                };
            }
        );
        console.log(deleteFoto);
    });

    FotoMitra.findByIdAndDelete(id, (err) => {
        if (err) {
            res.json({
                status: false,
                message: "Failed delete foto mitra",
                error: err,
            });
            return;
        }
        console.log("Success delete foto mitra");
        res.status(200).json({
            status: true,
            message: "Success delete foto mitra",
        });
    });
});

module.exports = router;
