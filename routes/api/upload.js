const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Upload = require("../../models/Upload");
const uploadDropbox = require("../DROPBOX_API/uploadDropbox");
const getSharedLink = require("../DROPBOX_API/getSharedLink");

const storage = multer.diskStorage({
    destination: path.join(__dirname + "./../../public/file4print"),
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});
var maxSize = 15 * 1024 * 1024;
const upload = multer({
    storage: storage,
    limits: { fileSize: maxSize },
}).array("myfile", 5);

router.post("/uploadfile", upload, async (req, res) => {
    // console.log(req.files);
    // res.status(200).json({
    //     status: true,
    //     message: "Success to upload file",
    // });
    const lengthFile = req.files.length;
    const newSharedLink = [];

    //looping untuk mengupload satu persatu file ke dropbox
    for (i = 0; i < lengthFile; i++) {
        let filename = req.files[i].filename;

        const fileFromDropBox = await uploadDropbox(filename).then(
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

        if (!fileFromDropBox.status) {
            console.log(fileFromDropBox.error);
            return res.status(500).json({
                status: false,
                message: fileFromDropBox.error,
            });
        }

        const path_display = fileFromDropBox.result.path_display;

        const sharedLink = await getSharedLink(path_display).then(
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

        if (!sharedLink.status) {
            console.log(sharedLink.error);
            return res.status(500).json({
                status: false,
                message: sharedLink.error,
            });
        }

        newSharedLink.push(sharedLink.result.url);
    }

    const newUpload = new Upload({
        link_file: newSharedLink,
    });

    newUpload.save((err, data) => {
        if (err) {
            console.log(err);
            return res.json({
                status: false,
                message: "Failed to upload file",
            });
        } else {
            console.log({
                status: true,
                message: "Success to upload file",
                data: data,
            });
            return res.status(200).json({
                status: true,
                message: "Success to upload file",
                data: data,
            });
        }
    });
});

module.exports = router;
