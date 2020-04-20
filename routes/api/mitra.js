const express = require("express");
const router = express.Router();
const Mitra = require("../../models/Mitra");

router.post('/mitra', (req,res) => {
    let data = req.body;

    const newMitra = new Mitra({
        nama_toko : data.nama_toko,
        nama_pemilik : data.nama_pemilik,
        email : data.email,
        no_hp : data.no_hp,
        harga : {
            print : data.harga.print,
            scan : data.harga.scan,
            fotocopy : data.harga.fotocopy,
        },
        alamat_toko : data.alamat_toko,
    });

    newMitra.save()
        .then(mitra => console.log(mitra))
        .catch(err => console.log(err));
    
    return res.status(200).json({status : true,
                                 message : 'Success added mitra',
                                 mitra : newMitra});
});

router.get('/mitra', (req,res) =>{
    //console.log(req.query.sort)
    let sorting = req.query.sort

    if(sorting == 'date'){
        Mitra.find()
        .sort({added : 'desc'})
        .exec()
        .then(mitra => {

            res.status(200).json({status : true,
                                  message : 'Success get mitra',
                                  mitra : mitra});
                                })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error : err
            })
        });
    }else{
        Mitra.find()
        .exec()
        .then(mitra => {

            res.status(200).json({status : true,
                                  message : 'Success get mitra',
                                  mitra : mitra});
                                })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error : err
            })
        });
    }
    
});

router.get('/mitra/:id', (req,res) => {
    const id = req.params.id;
    Mitra.findById(id)
        .exec()
        .then(mitra => {
            console.log(mitra);
            res.status(200).json(mitra);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error : err
            });
        });
});

module.exports = router;