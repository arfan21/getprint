const mongoose = require("mongoose");
const schema = mongoose.Schema;

const PesananSchema = new schema({
    userid_line: {
        type: String,
        required: true,
    },
    id_toko: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    id_file: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    nama_pemesan: {
        type: String,
        required: true,
    },
    nohp_pemesan: {
        type: String,
        required: true,
    },
    jenis_pesanan: {
        type: String,
        required: true,
    },
    lokasi: {
        alamat_pemesan: {
            type: String,
            required: true,
        },
        lat: {
            type: String,
            required: true,
        },
        lng: {
            type: String,
            required: true,
        },
    },
    delivery: {
        type: Boolean,
        required: true,
    },
    added: {
        type: Date,
        default: Date.now,
    },
});

module.exports = Pesanan = mongoose.model("pesanan", PesananSchema);
