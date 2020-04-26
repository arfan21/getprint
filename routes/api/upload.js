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

function joinarray2(e){
    e = e.join("%0A-")
}

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

        res.redirect("https://api.whatsapp.com/send?phone=6289635639022&text=**GETPRINT**%0ANama%20Pemesan%20%09%3A%20"+data[0].nama_pemesan+"%2C%0ANo%20HP%20%09%09%3A%20"+data[0].nohp_pemesan+"%2C%0AAlamat%20Pemesanan%3A%20"+data[0].alamat_pemesan+"%2C%0A**Jenis%20Pesanan**%0A"+"-"+data[0].jenis_pesanan.join("%0A-")+"%2C%0A**Link%20File**%0A"+linkconv.join('%0A'))
    })
     
})  

module.exports = router;

