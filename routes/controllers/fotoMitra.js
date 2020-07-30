const fotoMitra = require("../handlers/fotoMitra");
const multer = require("multer");

const upload = multer().single("mitraFoto");

const saveFotoMitra = async (req, res) => {
    const file = req.file;

    const newFotoMitra = await fotoMitra
        .saveFotoMitra(file)
        .then((result) => {
            return result;
        })
        .catch((err) => {
            return err;
        });

    if (!newFotoMitra.success) {
        return res.status(400).json({
            status: false,
            message: newFotoMitra.data,
        });
    }
    return res.json({
        status: true,
        message: "Success to upload foto mitra",
        data: newFotoMitra.data,
    });
};

const getFotoMitra = async (req, res) => {
    const id = req.params.id;

    const dataFoto = await fotoMitra
        .getFotoMitra(id)
        .then((result) => {
            return result;
        })
        .catch((err) => {
            return err;
        });

    if (!dataFoto.success) {
        return res.status(400).json({
            status: false,
            message: "failed get mitra",
            error: dataFoto.data,
        });
    }

    if (dataFoto.data == null) {
        return res.status(404).json({
            status: false,
            message: "failed get mitra",
            error: "Foto not found",
        });
    }

    return res.json({
        status: true,
        message: "Success get foto",
        data: dataFoto.data,
    });
};

const editFotoMitra = async (req, res) => {
    const id = req.params.id;
    const file = req.file;

    const dataFoto = await fotoMitra
        .editFotoMitra(id, file)
        .then((result) => {
            return result;
        })
        .catch((err) => {
            return err;
        });

    if (!dataFoto.success) {
        return res.status(400).json({
            status: false,
            message: "Failed to update foto",
            error: dataFoto.data,
        });
    }

    return res.status(200).json({
        status: true,
        message: "Success update foto mitra",
        data: dataFoto.data,
    });
};

const deleteFotoMitra = async (req, res) => {
    const id = req.params.id;
    const deleteHash = req.query.deleteHash;

    if (deleteHash == undefined) {
        return res.status(400).json({
            status: false,
            message: "Invalid request",
            error: "deleteHash is missing",
        });
    }

    const deletedFoto = await fotoMitra
        .deleteFoto(id, deleteHash)
        .then((result) => {
            return result;
        })
        .catch((err) => {
            return err;
        });

    if (!deletedFoto.success) {
        return res.status(400).json({
            status: false,
            message: "Failed to delete foto mitra",
            error: deletedFoto.data,
        });
    }

    return res.status(200).json({
        status: true,
        message: "Success delete foto mitra",
    });
};

module.exports = {
    saveFotoMitra: saveFotoMitra,
    getFotoMitra: getFotoMitra,
    editFotoMitra: editFotoMitra,
    deleteFotoMitra: deleteFotoMitra,
    upload: upload,
};
