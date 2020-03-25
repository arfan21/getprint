const express = require("express");
const router = express.Router();
const Mitra = require("../../models/Mitra");

router.post('/mitra', (req,res) => {
    let data = req.body;
    console.log(data);
    const newMitra = new Mitra({
        nama_toko : data.nama_toko,
        nama_pemilik : data.nama_pemilik,
        email : data.email,
        no_hp : data.no_hp,
        alamat_toko : data.alamat_toko,
    });

    newMitra.save()
        .then(mitra => res.json(mitra))
        .catch(err => console.log(err));
    
    return res.status(200).json(newMitra);
});

router.get('/mitra', (req,res) =>{
    Mitra.find()
        .exec()
        .then(mitra => {
            console.log(mitra);
            res.status(200).json(mitra);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error : err
            })
        });
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