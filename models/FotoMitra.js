const mongoose = require("mongoose");
const schema = mongoose.Schema;

const FotoMitraSchema = new schema({
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
