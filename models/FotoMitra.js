const mongoose = require('mongoose');
const schema = mongoose.Schema;

const UploadSchema = new schema({
    filename : {
        type : String,
        required : true,
    },
    link : {
        type : String,
        required : true,
    }    
})

module.exports = Upload = mongoose.model("mitrafoto", UploadSchema);