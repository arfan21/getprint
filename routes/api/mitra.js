const express = require("express");
const router = express.Router();
const Mitra = require("../../models/Mitra");

router.post('/mitra', (req,res) => {
    let data = req.body;

    const newMitra = new Mitra({
        link_foto : data.link_foto,
        deleteHash_foto : data.deleteHash_foto,
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

    newMitra.save((err,data) => {
        if(err){
            console.log({   
                status : false,
                message : 'Gagal menambahkan mitra, cek lagi data yang dimasukkan!',
                error : err
            })
            return res.json({
                status : false,
                message : 'Gagal menambahkan mitra, cek lagi data yang dimasukkan!',
                error : err
            })
        }
        console.log({
            status : true,
            message : 'Success added Mitra',
            pesanan : data
        })
        res.json({
            status : true,
            message : 'Success added Mitra',
            pesanan : data
        })
    })
});

router.get('/mitra', (req,res) =>{

    let sorting = req.query.sort

    if(sorting == 'date'){
        Mitra.find().sort({'added' : 1}).exec((err,data) => {
            if(err){
                return res.json({status : false,
                    message : 'failed get mitra',
                    error : err});
            }else if(data.length == 0){
                return res.json({status : false,
                    message : 'failed get mitra',
                    error : 'mitra not found'});
            }else{
                return res.status(200).json({status : true,
                    message : 'Success get mitra',
                    mitra : data});
            }
        });
        
    }else if(sorting == 'rating'){
        Mitra.find().sort({'rating.avg_point' : -1}).exec((err,data) => {
            if(err){
                return res.json({status : false,
                    message : 'failed get mitra',
                    error : err});
            }else if(data.length == 0){
                return res.json({status : false,
                    message : 'failed get mitra',
                    error : 'mitra not found'});
            }else{
                return res.status(200).json({status : true,
                    message : 'Success get mitra',
                    mitra : data});
            }
        });
    }else{
        Mitra.find().exec((err,data) => {
            if(err){
                return res.json({status : false,
                    message : 'failed get mitra',
                    error : err});
            }else if(data.length == 0){
                return res.json({status : false,
                    message : 'failed get mitra',
                    error : 'mitra not found'});
            }else{
                return res.status(200).json({status : true,
                    message : 'Success get mitra',
                    mitra : data});
            }
        });
    }
    
});

router.get('/mitra/:id', (req,res) => {
    const id = req.params.id

    Mitra.findById(id).exec((err,data) => {
        if(err){
            return res.json({status : false,
                message : 'failed get mitra',
                error : err});
        }else if(data.length == 0){
            return res.json({status : false,
                message : 'failed get mitra',
                error : 'mitra not found'});
        }else{
            return res.status(200).json({status : true,
                message : 'Success get mitra',
                mitra : data});
        }
    });

});

router.put('/mitra/:id', (req,res) => {
    const id = req.params.id;
    Mitra.findByIdAndUpdate(id, req.body, (err, data) => {
        if(err){
            res.json({status : false,
                message : 'Failed update mitra',
                error : err});
            return;
        }
        res.status(200).json({status : true,
            message : 'Success update mitra',
            mitra : req.body});
    })
})

router.delete('/mitra/:id', (req,res) => {
    const id = req.params.id;
    Mitra.findByIdAndDelete(id, (err) => {
        if(err){
            res.json({status : false,
                message : 'Failed delete mitra',
                error : err});
            return;
        }
        console.log('Success delete mitra');
        res.status(200).json({status : true,
            message : 'Success delete mitra'});
    })
})

module.exports = router;