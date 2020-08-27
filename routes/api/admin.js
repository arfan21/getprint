const express = require("express");
const router = express.Router();
const authLineIdToken = require("../middleware/middleware");

// List id line admin
const admin = ["U806e7bec3288e9572243e079aa7b6b16"];

router.post("/admincheck", authLineIdToken, (req, res) => {
    let uid = req.user.sub;

    for (i = 0; i < admin.length; i++) {
        if (uid == admin[i]) {
            return res.json({
                admin: true,
            });
        }
    }
    return res.json({
        admin: false,
    });
});

module.exports = router;
