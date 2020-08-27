const mongoose = require("mongoose");
const schema = mongoose.Schema;

const FotoMitraSchema = new schema({
    mitra_id: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    link_foto: {
        type: String,
        required: true,
    },
    deleteHash_foto: {
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

module.exports = Upload = mongoose.model("fotoMitra", FotoMitraSchema);
