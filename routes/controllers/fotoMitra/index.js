const create = require("./create");
const deleteFoto = require("./delete");

const multer = require("multer");

const upload = multer().single("mitraFoto");

module.exports = {
    create,

    deleteFoto,
    upload,
};
