const mongoose = require('mongoose');
const schema = mongoose.Schema;

const MitraSchema = new schema({
    id_foto: {
        type : mongoose.Schema.ObjectId,
        required : true,
    },
    nama_toko:{
        type : String,
        required : true
    },
    nama_pemilik:{
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    no_hp:{
        type : String,
        required : true
    },
    harga : {
        print : {type : String},
        scan : {type : String},
        fotocopy : {type : String},
    },
    alamat_toko:{
        type : String,
        required : true
    },
    added:{
        type : String,
        default : new Date().toString()
    }
});

module.exports = Mitra = mongoose.model("mitra", MitraSchema);