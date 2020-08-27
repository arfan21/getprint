const multer = require("multer");
const upload = multer().array("myfile", 5);

module.exports = {
    create: require("./create"),
    delete: require("./delete"),
    upload,
};
