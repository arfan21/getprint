const express = require("express");
const router = express.Router();
const Mitra = require("../../models/Mitra");
const mongoose = require('mongoose');

router.post('/mitra', (req,res) => {
    let data = req.body;

    const newMitra = new Mitra({
        link_foto : data.linkfoto,
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

    let sorting = req.query.sort

    if(sorting == 'date'){
        Mitra.aggregate([
            {$sort : {added : -1}},
        ]).exec((err,data) => {
            if(err){
                res.status(400).json({status : false,
                    message : 'failed get mitra',
                    error : err});
            }else if(data.length == 0){
                res.status(400).json({status : false,
                    message : 'failed get mitra',
                    error : 'mitra not found'});
            }else{
                res.status(200).json({status : true,
                    message : 'Success get mitra',
                    mitra : data});
            }
        });
        
    }else{
        Mitra.find().exec((err,data) => {
            if(err){
                res.status(400).json({status : false,
                    message : 'failed get mitra',
                    error : err});
            }else if(data.length == 0){
                res.status(400).json({status : false,
                    message : 'failed get mitra',
                    error : 'mitra not found'});
            }else{
                res.status(200).json({status : true,
                    message : 'Success get mitra',
                    mitra : data});
            }
        });
    }
    
});

router.get('/mitra/:id', (req,res) => {
    const id = req.params.id;

    Mitra.aggregate([
        {$match : {'_id' : mongoose.Types.ObjectId(id)}},
    ]).exec((err,data) => {
        if(err){
            res.status(400).json({status : false,
                message : 'failed get mitra',
                error : err});
        }else if(data.length == 0){
            res.status(400).json({status : false,
                message : 'failed get mitra',
                error : 'mitra not found'});
        }else{
            res.status(200).json({status : true,
                message : 'Success get mitra',
                mitra : data});
        }
    });

});

module.exports = router;