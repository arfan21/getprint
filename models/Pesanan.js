const mongoose = require('mongoose');
const schema = mongoose.Schema;

const PesananSchema = new schema({
    userid_line : {
        type : String,
        required : true,
    },
    id_toko : {
        type : mongoose.Schema.ObjectId,
        required : true,
    },
    nama_pemesan : {
        type : String,
        required : true
    },
    nohp_pemesan : {
        type : String,
        required : true
    }, 
    jenis_pesanan : {
        type : [String],
        required : true
    },
    alamat_pemesan : {
        type : String,
        required : true
    },
    link_file : {
        type : String,
        required : true,
    },
    added : {
        type : Date,
        default : Date.now
    }
});

module.exports = Pesanan = mongoose.model("pesanan", PesananSchema);