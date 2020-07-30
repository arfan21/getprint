const mongoose = require("mongoose");
const schema = mongoose.Schema;

const UploadSchema = new schema({
    link_file: {
        type: [String],
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
