const mongoose = require('mongoose');
const schema = mongoose.Schema;

const MitraSchema = new schema({
    link_foto: {
        type : String,
        required : true,
    },
    deleteHash_foto:{
        type : String,
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
    rating : {
        total_point : {
            type : Number,
            default : 0,
        },
        avg_point : {
            type : Number,
            default : 0,
        },
        total_rating : {
            type : Number,
            default : 0,
        },
        user_rating : [
            {
                userid_line : {
                    type : String,
                },
                rating_user : {
                    type : Number,
                }
            }
        ]
    },
    added:{
        type : Date,
        default : Date.now
    }
});


module.exports = Mitra = mongoose.model("mitra", MitraSchema);