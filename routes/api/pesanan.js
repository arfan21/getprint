const express = require("express");
const router = express.Router();
const Pesanan = require("../../models/Pesanan");

router.post('/pesanan', (req,res) => {
    let data = req.body;
    console.log(data);
});