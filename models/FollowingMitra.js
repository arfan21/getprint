const mongoose = require("mongoose");
const schema = mongoose.Schema;

const FollowingMitraSchema = new schema({
    userid_line: {
        type: String,
        required: true,
    },
    id_toko: {
        type: mongoose.Schema.ObjectId,
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

module.exports = FollowingMitra = mongoose.model(
    "followingmitra",
    FollowingMitraSchema
);
