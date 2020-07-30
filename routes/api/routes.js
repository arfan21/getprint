const express = require("express");
const router = express.Router();

const mitraController = require("../controllers/mitra");
const fotoMitraController = require("../controllers/fotoMitra");
const followingMitraController = require("../controllers/followingMitra");
const filesController = require("../controllers/files");
const pesananController = require("../controllers/pesanan");

const authLineIdToken = require("../middleware/middleware");

//route mitra
router.post("/mitra", authLineIdToken, mitraController.saveMitra);
router.get("/mitra", mitraController.getAllMitras);
router.get("/mitrainactive", mitraController.getAllMitrasInactive);
router.get("/mitra/:id", mitraController.getMitra);
router.put("/mitra/:id", authLineIdToken, mitraController.editMitra);
router.delete("/mitra/:id", authLineIdToken, mitraController.deleteMitra);

//route foto mitra

router.post(
    "/fotomitra",
    fotoMitraController.upload,
    authLineIdToken,
    fotoMitraController.saveFotoMitra
);
router.get("/fotomitra/:id", fotoMitraController.saveFotoMitra);
router.put(
    "/fotomitra/:id",
    fotoMitraController.upload,
    authLineIdToken,
    fotoMitraController.editFotoMitra
);
router.delete(
    "/fotomitra/:id",
    authLineIdToken,
    fotoMitraController.deleteFotoMitra
);

//route follow mitra

router.post(
    "/followmitra",
    authLineIdToken,
    followingMitraController.saveFollowingMitra
);
router.get(
    "/followmitra",
    authLineIdToken,
    followingMitraController.getFollowingMitra
);
router.delete(
    "/followmitra/:id",
    authLineIdToken,
    followingMitraController.deleteFollowingMitra
);

//route upload file

router.post(
    "/uploadfile",
    filesController.upload,
    authLineIdToken,
    filesController.saveFiles
);

//route pesanan
router.post("/pesanan", authLineIdToken, pesananController.savePesanan);
router.get("/pesanan", pesananController.getPesanan);

module.exports = router;
