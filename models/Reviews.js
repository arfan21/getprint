const mongoose = require("mongoose");
const schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

const ReviewSchema = new schema({
    mitra_id: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    user_id: {
        type: String,
        required: true,
    },
    rating_user: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
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

ReviewSchema.index({ user_id: 1, mitra_id: 1 }, { unique: true });
ReviewSchema.plugin(uniqueValidator);

module.exports = Review = mongoose.model("reviews", ReviewSchema);
