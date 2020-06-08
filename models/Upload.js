const mongoose = require('mongoose');
const schema = mongoose.Schema;

const UploadSchema = new schema({
    link_file : {
        type : [String],
        required : true,
    }
})

module.exports = Upload = mongoose.model("upload", UploadSchema);