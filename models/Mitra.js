const mongoose = require('mongoose');
const schema = mongoose.Schema;

const MitraSchema = new schema({
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
        type : Date,
        default : Date.now
    }
});

module.exports = Mitra = mongoose.model("mitra", MitraSchema);