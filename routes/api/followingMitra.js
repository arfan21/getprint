const express = require("express");
const router = express.Router();
const FollowingMitra = require("../../models/FollowingMitra");

router.post("/followingmitra", async (req, res) => {
    let data = req.body;

    const NewFollowingmitra = new FollowingMitra({
        userid_line: data.userid_line,
        id_toko: data.id_toko,
    });

    NewFollowingmitra.save((err, data) => {
        if (err) {
            console.log({
                status: false,
                message: "Failed to following mitra!",
                error: err,
            });
            return res.json({
                status: false,
                message: "Failed to following mitra!",
                error: err,
            });
        }
        console.log({
            status: true,
            message: "Success following mitra!",
            followingdata: data,
        });
        res.json({
            status: true,
            message: "Success following mitra!",
            followingdata: data,
        });
    });
});

router.get("/followingmitra/:useridline", (req, res) => {
    const id = req.params.useridline;

    FollowingMitra.aggregate([
        { $match: { userid_line: id } },
        {
            $lookup: {
                from: "mitras",
                localField: "id_toko",
                foreignField: "_id",
                as: "toko",
            },
        },
    ]).exec((err, data) => {
        if (err) {
            return res.json({
                status: false,
                message: "failed get following mitra",
                error: err,
            });
        } else if (data.length == 0) {
            return res.json({
                status: false,
                message: "failed get following mitra",
                error: "following mitra not found",
            });
        } else {
            return res.status(200).json({
                status: true,
                message: "Success get following mitra",
                followingdata: data,
            });
        }
    });
});

router.get("/followingmitra/byid/:id", (req, res) => {
    const id = req.params.id;

    FollowingMitra.findById(id).exec((err, data) => {
        if (err) {
            return res.json({
                status: false,
                message: "failed get following mitra",
                error: err,
            });
        } else if (data == null) {
            return res.json({
                status: false,
                message: "failed get following mitra",
                error: "following mitra not found",
            });
        } else {
            return res.status(200).json({
                status: true,
                message: "Success get following mitra",
                followingdata: data,
            });
        }
    });
});

router.delete("/followingmitra/:id", (req, res) => {
    const id = req.params.id;
    FollowingMitra.findById(id).exec((err, data1) => {
        FollowingMitra.findByIdAndDelete(id, (err, data) => {
            if (err) {
                res.json({
                    status: false,
                    message: "Failed delete following mitra",
                    error: err,
                });
                return;
            }
            console.log("Success delete following mitra");
            return res.status(200).json({
                status: true,
                message: "Success delete following mitra",
                followingdata: data1,
            });
        });
    });
});

module.exports = router;
