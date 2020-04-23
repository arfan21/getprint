const express = require("express");
const router = express.Router();
const Pesanan = require("../../models/Pesanan");

router.post('/pesanan', (req,res) => {
    let data = req.body;

    const newPesanan = new Pesanan({
        userid_line : data.userid_line,
        id_toko : data.id_toko,
        nama_pemesan : data.nama,
        nohp_pemesan : data.nohp_pemesan,
        jenis_pesanan : [data.print, data.fotocopy, data.scan],
        alamat_pemesan : data.alamat_pemesan,
    })

    newPesanan.save()
        .then(pesanan => 
            console.log(pesanan),
            res.status(200).json({status : true,
                            message : 'Success added Pesanan',
                            pesanan : newPesanan})
            )
        .catch(err => 
            console.log(err),
            res.status(400).json({status : false,
                message : 'Pesanan gagal, cek lagi data yang dimasukkan!',
                })
            );

    
});

router.get('/pesanan/:lineid', (req,res) => {
    const lineid = req.params.lineid;
    Pesanan.find({userid_line : lineid})
        .sort({added : 'desc'})
        .exec()
        .then(pesanan => {
            console.log(pesanan);
            res.status(200).json({status : true,
                                message : 'Success get pesanan',
                                pesanan : pesanan});
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error : err
            })
        })
});

module.exports = router