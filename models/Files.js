const mongoose = require("mongoose");
const { type } = require("../routes/handlers/LINE/templatePesanan");
const schema = mongoose.Schema;

const UploadSchema = new schema({
    pesanan_id: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },

    link_file: {
        type: String,
        required: true,
    },
    path: {
        type: String,
        required: true,
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

module.exports = Upload = mongoose.model("files", UploadSchema);
