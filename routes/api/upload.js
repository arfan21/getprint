const express = require("express");
const router = express.Router();
const multer = require('multer');
const path   = require('path');
const Upload = require("../../models/Upload");
const mongoose = require('mongoose');
const request = require("request");
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

    for(i = 0; i < req.files.length;i++){

        let filename = req.files[i].filename;
        request({
            method: "POST",
            url : "https://content.dropboxapi.com/2/files/upload",
            headers: {
                'Content-Type': 'application/octet-stream',
                'Authorization' : 'Bearer <token>',
                'Dropbox-API-Arg' : "{\"path\": \"/getprint/"+filename+"\",\"mode\": \"add\",\"autorename\": true,\"mute\": false,\"strict_conflict\": false}",
            },
            body : fs.readFileSync(path.join(__dirname + './../../public/file4print/' + filename))
        }, (err, response, body) => {
            let resJson = JSON.parse(body)
            request({
                method: "POST",
                url : "https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : 'Bearer <token>',
                },
                body : "{\"path\": \""+resJson.path_display+"\"}",
            }, (err, response, body) => {
                resJson = JSON.parse(body)
                newfile.push(resJson.url)
                if(newfile.length == req.files.length){
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
    
    // const newUpload = new Upload({
    //     id_pesanan : '5edcde17fee7e00004677cf9',
    //     file : newfile,
    // })

    // newUpload.save()
    //     .then(upload => console.log(upload))
    //     .catch(err => console.log(err));

    // request({
    //     url : "https://getprint.herokuapp.com/api/pesanan/byid/" + req.body.pesananid,
    //     json : true,
    // }, (err, response, body) => {
    //     var data = body.pesanan
    //     var link
    //     var linkconv = []
    //     for(i = 0; i < newUpload.file.length; i++){
    //         link = "https://getprint.herokuapp.com" + newUpload.file[i].link
    //         linkconv.push(encodeURI(link)) 
    //     }
    //     return res.status(200).json({status : true,
    //             message : 'Success upload file',
    //             data : data,
    //             link : linkconv});
    // })
     
})  

module.exports = router;