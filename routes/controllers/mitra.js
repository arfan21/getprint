const mitra = require("../handlers/mitra");
const fotoMitra = require("../handlers/fotoMitra");

const saveMitra = async (req, res) => {
    const data = req.body;

    const newMitra = await mitra
        .saveMitra(data)
        .then((result) => {
            return result;
        })
        .catch((err) => {
            return err;
        });

    if (!newMitra.success) {
        return res.status(400).json({
            status: false,
            message: "Failed added Mitra",
            error: newMitra.data,
        });
    }

    return res.json({
        status: true,
        message: "Success added Mitra",
        data: newMitra.data,
    });
};

const getAllMitras = async (req, res) => {
    const sort = {};

    if (req.query.sort) {
        if (req.query.sort == "rating") {
            sort["rating.avg_point"] = -1;
        } else {
            sort[req.query.sort] = -1;
        }
    } else {
        sort["created_at"] = 1;
    }

    const dataMitra = await mitra
        .getAllMitras(sort)
        .then((result) => {
            return result;
        })
        .catch((err) => {
            return err;
        });

    if (!dataMitra.success) {
        return res.status(400).json({
            status: false,
            message: "failed get mitra",
            error: dataMitra.data,
        });
    }

    if (dataMitra.data.length == 0) {
        return res.status(404).json({
            status: false,
            message: "failed get mitra",
            error: "Mitra not found",
        });
    }

    return res.status(200).json({
        status: true,
        message: "Success get mitra",
        data: dataMitra.data,
    });
};

const getAllMitrasInactive = async (req, res) => {
    const sort = {};

    if (req.query.sort) {
        if (req.query.sort == "rating") {
            sort["rating.avg_point"] = -1;
        } else {
            sort[req.query.sort] = -1;
        }
    } else {
        sort["created_at"] = 1;
    }

    const dataMitra = await mitra
        .getAllMitrasInactive(sort)
        .then((result) => {
            return result;
        })
        .catch((err) => {
            return err;
        });

    if (!dataMitra.success) {
        return res.status(400).json({
            status: false,
            message: "failed get mitra",
            error: dataMitra.data,
        });
    }

    if (dataMitra.data.length == 0) {
        return res.status(404).json({
            status: false,
            message: "failed get mitra",
            error: "Mitra not found",
        });
    }

    return res.status(200).json({
        status: true,
        message: "Success get mitra",
        data: dataMitra.data,
    });
};

const getMitra = async (req, res) => {
    const id = req.params.id;

    const dataMitra = await mitra
        .getMitra(id)
        .then((result) => {
            return result;
        })
        .catch((err) => {
            return err;
        });

    if (!dataMitra.success) {
        return res.status(400).json({
            status: false,
            message: "failed get mitra",
            error: dataMitra.data,
        });
    }

    if (dataMitra.data.length == 0) {
        return res.status(404).json({
            status: false,
            message: "failed get mitra",
            error: "Mitra not found",
        });
    }

    return res.status(200).json({
        status: true,
        message: "Success get mitra",
        data: dataMitra.data,
    });
};

const editMitra = async (req, res) => {
    const id = req.params.id;

    const dataMitra = await mitra
        .editMitra(id, req.body)
        .then((result) => {
            return result;
        })
        .catch((err) => {
            return err;
        });

    if (!dataMitra.success) {
        return res.status(500).json({
            status: false,
            message: "Failed update mitra",
            error: dataMitra.data,
        });
    }

    return res.status(200).json({
        status: true,
        message: "Success update mitra",
        data: dataMitra.data,
    });
};

const deleteMitra = async (req, res) => {
    const id = req.params.id;
    const idFoto = req.query.idFoto;
    const deleteHash = req.query.deleteHash;

    if (deleteHash == undefined || idFoto == undefined) {
        return res.status(400).json({
            status: false,
            message: "Invalid request",
            error: "there are some missing queries",
        });
    }

    const deletedFoto = await fotoMitra
        .deleteFoto(idFoto, deleteHash)
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

    const deletedMitra = await mitra
        .deleteMitra(id)
        .then((result) => {
            return result;
        })
        .catch((err) => {
            return err;
        });

    if (!deletedMitra.success) {
        return res.status(400).json({
            status: false,
            message: "Failed delete mitra",
            error: deletedMitra.data,
        });
    }

    return res.json({
        status: true,
        message: deletedMitra.data,
    });
};

module.exports = {
    saveMitra: saveMitra,
    getAllMitras: getAllMitras,
    getAllMitrasInactive: getAllMitrasInactive,
    getMitra: getMitra,
    editMitra: editMitra,
    deleteMitra: deleteMitra,
};
