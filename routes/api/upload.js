const express = require("express");
const router = express.Router();
const multer = require('multer');
const path   = require('path');
const Upload = require("../../models/Upload");
const mongoose = require('mongoose');
const request = require("request");
const axios = require("axios")
const fs = require("fs")

const storage = multer.diskStorage({
    destination :  path.join(__dirname + './../../public/file4print'),
    filename: function(req, file, cb){
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({storage : storage}).array('myfile',5);

router.post("/uploadfile",upload, (req,res) => {
    var newfile = [];

    //looping untuk mengupload satu persatu file ke dropbox

    for(i = 0; i < req.files.length;i++){
        let filename = req.files[i].filename;
        request({
            method: "POST",
            url : "https://content.dropboxapi.com/2/files/upload",
            headers: {
                'Content-Type': 'application/octet-stream',
                'Authorization' : 'Bearer ROeWeTjqfBAAAAAAAAAAUkKjzCS2pmeDufip5j0cRareedsNLp_H1KLHLQjj71AU',
                'Dropbox-API-Arg' : "{\"path\": \"/getprint/"+filename+"\",\"mode\": \"add\",\"autorename\": true,\"mute\": false,\"strict_conflict\": false}",
            },
            body : fs.readFileSync(path.join(__dirname + './../../public/file4print/' + filename))
        }, (err, response, body) => {
            let resJson = JSON.parse(body)

            //melakukan request ke dropbox untuk membuat shared link dari file yang sudah di upload

            request({
                method: "POST",
                url : "https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : 'Bearer ROeWeTjqfBAAAAAAAAAAUkKjzCS2pmeDufip5j0cRareedsNLp_H1KLHLQjj71AU',
                },
                body : "{\"path\": \""+resJson.path_display+"\"}",
            }, (err, response, body) => {
                resJson = JSON.parse(body)

                //shared link di simpan di array newfile

                newfile.push(resJson.url)

                //jika panjang array new file == panjang dari request file (atau sudah di akhir looping)

                if(newfile.length == req.files.length){

                    //shared link disimpan ke mongodb
                    
                    const newUpload = new Upload({
                        id_pesanan : '5edcde17fee7e00004677cf9',
                        link_file : newfile,
                    })
                    newUpload.save((err, data) => {
                        if(err){
                            console.log(err)
                            return res.json({
                                status : false, 
                                message : "Failed to upload file"
                            })
                        }else{
                            console.log(data)
                            return res.status(200).json({
                                status : true, 
                                message : "Success to upload file",
                                data : data,
                            })
                        }
                    })
                }
            })
        })
    }
})  

module.exports = router;