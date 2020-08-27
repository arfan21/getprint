const mongoose = require("mongoose");
const schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

const MitraSchema = new schema({
    user_id: {
        type: String,
        required: true,
    },
    nama_toko: {
        type: String,
        required: true,
    },
    nama_pemilik: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    no_hp: {
        type: String,
        required: true,
        unique: true,
    },
    harga: {
        print: { type: String },
        scan: { type: String },
        fotocopy: { type: String },
    },
    alamat_toko: {
        type: String,
        required: true,
    },
    coords: {
        lat: {
            type: String,
            required: true,
        },
        lng: {
            type: String,
            required: true,
        },
    },
    status: {
        type: String,
        default: "inactive",
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
});

MitraSchema.plugin(uniqueValidator, { message: "{PATH} has been registered" });
module.exports = Mitra = mongoose.model("mitra", MitraSchema);
