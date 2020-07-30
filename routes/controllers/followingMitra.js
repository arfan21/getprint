const followingMitra = require("../handlers/followingMitra");
const mongoose = require("mongoose");

const saveFollowingMitra = async (req, res) => {
    const newFollowingMitra = await followingMitra
        .saveFollowingMitra(req.body)
        .then((result) => {
            return result;
        })
        .catch((err) => {
            return err;
        });

    if (!newFollowingMitra.success) {
        return res.status(400).json({
            status: false,
            message: "Failed follow mitra",
            error: newFollowingMitra.data,
        });
    }

    res.json({
        status: true,
        message: "Success following mitra!",
        data: newFollowingMitra.data,
    });
};

const getFollowingMitra = async (req, res) => {
    const match = {};

    if (req.query.match == "_id") {
        if (req.query.id) {
            if (!mongoose.Types.ObjectId.isValid(req.query.id)) {
                return res.status(400).json({
                    status: false,
                    message: "Invalid request",
                    error: "invalid ID",
                });
            }
            match[req.query.match] = mongoose.Types.ObjectId(req.query.id);
        } else {
            return res.status(400).json({
                status: false,
                message: "Invalid request",
                error: "not match query",
            });
        }
    } else if (req.query.match == "userid_line") {
        if (req.query.userid_line) {
            match[req.query.match] = req.query.userid_line;
        } else {
            return res.status(400).json({
                status: false,
                message: "Invalid request",
                error: "not match query",
            });
        }
    } else {
        return res.status(400).json({
            status: false,
            message: "Invalid request",
            error: "there are some missing queries",
        });
    }

    const dataFollow = await followingMitra
        .getFollowingMitras(match)
        .then((result) => {
            return result;
        })
        .catch((err) => {
            return err;
        });

    if (!dataFollow.success) {
        return res.status(400).json({
            status: false,
            message: "Failed get data following mitra",
            error: dataFollow.data,
        });
    }

    return res.json({
        status: true,
        message: "Success get data following mitra",
        data: dataFollow.data,
    });
};

const deleteFollowingMitra = async (req, res) => {
    const id = req.params.id;

    const deletedFollow = await followingMitra
        .deleteFollowingMitra(id)
        .then((result) => {
            return result;
        })
        .catch((err) => {
            return err;
        });

    if (!deletedFollow.success) {
        return res.status(400).json({
            status: false,
            message: "Failed delete data following mitra",
            error: deletedFollow.data,
        });
    }

    return res.json({
        status: true,
        message: "Success delete data following mitra",
        data: deletedFollow.data,
    });
};

module.exports = {
    saveFollowingMitra: saveFollowingMitra,
    getFollowingMitra: getFollowingMitra,
    deleteFollowingMitra: deleteFollowingMitra,
};
