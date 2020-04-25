const mongoose = require('mongoose');
const schema = mongoose.Schema;

const UploadSchema = new schema({
    id_pesanan : {
        type : mongoose.Schema.ObjectId,
        required : true,
    },
    file :[{
        filename : {
            type : String,
            required : true,
        },
        link : {
            type : String,
            required : true,
        }    
    }] 
})

module.exports = Upload = mongoose.model("upload", UploadSchema);