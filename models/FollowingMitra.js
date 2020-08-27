const mongoose = require("mongoose");
const schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

const FollowingMitraSchema = new schema({
    user_id: {
        type: String,
        required: true,
    },
    mitra_id: {
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

FollowingMitraSchema.index({ user_id: 1, mitra_id: 1 }, { unique: true });
FollowingMitraSchema.plugin(uniqueValidator);

module.exports = FollowingMitra = mongoose.model(
    "followingmitra",
    FollowingMitraSchema
);
