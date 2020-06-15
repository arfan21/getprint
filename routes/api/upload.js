const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Upload = require("../../models/Upload");
const request = require("request");
const fs = require("fs");
const DROPBOX_TOKEN =
    "ROeWeTjqfBAAAAAAAAABUfxgBUzLqsMc3fkcKP43PVKQIqCRTKa0V3pTTEyrii7g";

const storage = multer.diskStorage({
    destination: path.join(__dirname + "./../../public/file4print"),
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});

const upload = multer({ storage: storage }).array("myfile", 5);

router.post("/uploadfile", upload, (req, res) => {
    //looping untuk mengupload satu persatu file ke dropbox
    let newfile = [];

    for (i = 0; i < req.files.length; i++) {
        let filename = req.files[i].filename;
        request(
            {
                method: "POST",
                url: "https://content.dropboxapi.com/2/files/upload",
                headers: {
                    "Content-Type": "application/octet-stream",
                    Authorization: "Bearer " + DROPBOX_TOKEN,
                    "Dropbox-API-Arg":
                        '{"path": "/getprint/' +
                        filename +
                        '","mode": "add","autorename": true,"mute": false,"strict_conflict": false}',
                },
                body: fs.readFileSync(
                    path.join(
                        __dirname + "./../../public/file4print/" + filename
                    )
                ),
            },
            (err, response, body) => {
                let resJson = JSON.parse(body);

                //melakukan request ke dropbox untuk membuat shared link dari file yang sudah di upload

                request(
                    {
                        method: "POST",
                        url:
                            "https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer " + DROPBOX_TOKEN,
                        },
                        body: '{"path": "' + resJson.path_display + '"}',
                    },
                    (err, response, body) => {
                        resJson = JSON.parse(body);

                        //shared link di simpan di array newfile

                        newfile.push(resJson.url);

                        //jika panjang array new file == panjang dari request file (atau sudah di akhir looping)

                        if (newfile.length == req.files.length) {
                            //shared link disimpan ke mongodb

                            const newUpload = new Upload({
                                link_file: newfile,
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
                        }
                    }
                );
            }
        );
    }
});

module.exports = router;
