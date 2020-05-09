const express = require("express");
const router = express.Router();
const multer = require('multer');
const path   = require('path');
const Upload = require("../../models/FotoMitra");

const storage = multer.diskStorage({
    destination :  path.join(__dirname + './../../public/assets'),
    filename: function(req, file, cb){
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({
    storage : storage
}).single('mitraFoto');


router.post("/uploadfotomitra",upload, (req,res) => {
    
    const newUpload = new Upload({
        filename : req.file.filename,
        link : '/assets/' + req.file.filename,
    })

    newUpload.save()
        .then(upload => console.log(upload))
        .catch(err => console.log(err));
    
    return res.status(200).json({status : true,
            message : 'Success upload foto mitra',
            fotomitra : newUpload});
})  

module.exports = router;