const express = require("express");
const router = express.Router();
const multer = require('multer');
const path   = require('path');

const storage = multer.diskStorage({
    destination :  path.join(__dirname + './../../public/file4print'),
    filename: function(req, file, cb){
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({
    storage : storage
});

router.post("/uploadfile", (req,res) => {
    upload.single('myfile')(req, res, function (error) {
        if (error) {
          console.log(`upload.single error: ${error}`);
          return res.sendStatus(500);
        }
        res.status(200).json({status : true,    
                                  message : 'Success upload file',
                                  file : `uploads/${req.file.filename}`});
    })
     
})

module.exports = router;



