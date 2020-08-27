const express = require("express");
const router = express.Router();

const mitraController = require("../controllers/mitra/");
const fotoMitraController = require("../controllers/fotoMitra/");
const followingMitraController = require("../controllers/followingMitra/");
const filesController = require("../controllers/files/");
const pesananController = require("../controllers/pesanan/");
const reviewsController = require("../controllers/reviews/");

const authLineIdToken = require("../middleware/middleware");

//route mitra
router.post("/mitra", authLineIdToken, mitraController.create);
router.get("/mitra", mitraController.getAll);
router.get("/mitrainactive", authLineIdToken, mitraController.getAllinActive);
router.get("/mitra/:id", mitraController.get);
router.put("/mitra/:id", authLineIdToken, mitraController.update);
router.delete("/mitra/:id", authLineIdToken, mitraController.deleteMitra);

//route foto mitra
router.post(
    "/fotomitra",
    authLineIdToken,
    fotoMitraController.upload,
    fotoMitraController.create
);
router.delete(
    "/fotomitra/:id",
    authLineIdToken,
    fotoMitraController.deleteFoto
);

//route follow mitra
router.post("/followmitra", authLineIdToken, followingMitraController.create);
router.get("/followmitra", authLineIdToken, followingMitraController.get);
router.delete(
    "/followmitra/:id",
    authLineIdToken,
    followingMitraController.delete
);

//route upload file
router.post(
    "/uploadfile",
    authLineIdToken,
    filesController.upload,
    filesController.create
);
router.delete("/uploadfile/:id", authLineIdToken, filesController.delete);

//route pesanan
router.post("/pesanan", authLineIdToken, pesananController.create);
router.get("/pesanan", pesananController.get);
router.delete("/pesanan/:id", authLineIdToken, pesananController.delete);

//route reviews
router.post("/reviews", authLineIdToken, reviewsController.create);
router.put("/reviews/:id", authLineIdToken, reviewsController.update);
router.delete("/reviews/:id", authLineIdToken, reviewsController.deleteMitra);

module.exports = router;
