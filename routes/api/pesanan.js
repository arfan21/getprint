const express = require("express");
const router = express.Router();
const Pesanan = require("../../models/Pesanan");

router.post('/pesanan', (req,res) => {
    let data = req.body;

    const newPesanan = new Pesanan({
        nama_pemesan : data.nama,
        nohp_pemesan : data.nohp_pemesan,
        jenis_pesanan : [data.print, data.fotocopy, data.scan],
        alamat_pemesan : data.alamat_pemesan,
    })

    newPesanan.save()
        .then(pesanan => console.log(pesanan))
        .catch(err => console.log(err));

    return res.status(200).json({status : true,
                            message : 'Success added Pesanan',
                            pesanan : newPesanan});
});

module.exports = router