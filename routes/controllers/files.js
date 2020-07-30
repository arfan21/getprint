const files = require("../handlers/files");
const multer = require("multer");
const upload = multer().array("myfile", 5);

const saveFiles = async (req, res) => {
    const dataFile = await files
        .saveFiles(req.files)
        .then((result) => {
            return result;
        })
        .catch((err) => {
            return err;
        });

    if (!dataFile.success) {
        return res.status(400).json({
            status: false,
            message: "Failed to upload file",
            error: dataFile.data,
        });
    }

    return res.status(200).json({
        status: true,
        message: "Success to upload file",
        data: dataFile.data,
    });
};

module.exports = {
    saveFiles: saveFiles,
    upload: upload,
};
