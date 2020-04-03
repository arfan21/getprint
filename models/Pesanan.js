const mongoose = require('mongoose');
const schema = mongoose.Schema;

const pointSchema = new mongoose.Schema({
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
});

const PesananSchema = new schema({
    nama_pemesan : {
        type : String,
        required : true
    },
    nama_toko : {
        type : String,
        required : true
    },
    nohp_pemesan : {
        type : String,
        required : true
    },
    alamat_pemesan : {
        type : String,
        required : true
    },
    jenis_pesanan : {
        type : [String],
        required : true
    },
    delivery : {
        type : Boolean,
        required : true
    },
    posisi : {
        type : pointSchema,
        required : true,
    },
    added : {
        type : Date,
        default : Date.now
    }
});

module.exports = Pesanan = mongoose.model("pesanan", PesananSchema);