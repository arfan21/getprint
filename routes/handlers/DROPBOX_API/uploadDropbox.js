const { default: Axios } = require("axios");

const path = require("path");

const { DROPBOX_TOKEN } = process.env;

const uploadDropbox = (file) => {
    var filename =
        file.fieldname + "-" + Date.now() + path.extname(file.originalname);

    const promise = new Promise(async (resolve, reject) => {
        Axios({
            method: "POST",
            url: "https://content.dropboxapi.com/2/files/upload",
            headers: {
                "Content-Type": "application/octet-stream",
                Authorization: "Bearer " + DROPBOX_TOKEN,
                "Dropbox-API-Arg":
                    '{"path": "/getprint/' +
                    filename +
                    '","mode": "add","autorename": true,"mute": false,"strict_conflict": false}',
            },
            data: file.buffer,
        }).then(
            (result) => {
                resolve(result.data);
            },
            (err) => {
                reject(err);
            }
        );
    });

    return promise;
};

module.exports = uploadDropbox;
