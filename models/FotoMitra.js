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
});

module.exports = Upload = mongoose.model("fotoMitra", FotoMitraSchema);
