const express = require("express");
const router = express.Router();
const multer = require('multer');
const path   = require('path');
const Upload = require("../../models/Upload");
const mongoose = require('mongoose');
const request = require("request");

const storage = multer.diskStorage({
    destination :  path.join(__dirname + './../../public/file4print'),
    filename: function(req, file, cb){
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({
    storage : storage
}).array('myfile',5);

router.post("/uploadfile",upload, (req,res) => {
    let newfile = []
    for(i = 0; i < req.files.length;i++){
        newfile.push(
            {
                filename :  req.files[i].filename,
                link : '/file4print/' + req.files[i].filename,
            }
        )
    }
    
    const newUpload = new Upload({
        id_pesanan : req.body.pesananid ,
        file : newfile,
    })

    newUpload.save()
        .then(upload => console.log(upload))
        .catch(err => console.log(err));

    request({
        url : "https://getprint.herokuapp.com/api/pesanan/byid/" + req.body.pesananid,
        json : true,
    }, (err, response, body) => {
        var data = body.pesanan
        var link
        var linkconv = []
        for(i = 0; i < newUpload.file.length; i++){
            link = "https://getprint.herokuapp.com" + newUpload.file[i].link
            linkconv.push(encodeURI(link)) 
        }
        return res.status(200).json({status : true,
                message : 'Success upload file',
                data : data,
                link : linkconv});
    })
     
})  

module.exports = router;

