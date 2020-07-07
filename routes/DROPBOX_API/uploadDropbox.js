const { default: Axios } = require("axios");
const fs = require("fs");
const path = require("path");

const DROPBOX_TOKEN = "token";

const uploadDropbox = (file) => {
    const promise = new Promise((resolve, reject) => {
        Axios({
            method: "POST",
            url: "https://content.dropboxapi.com/2/files/upload",
            headers: {
                "Content-Type": "application/octet-stream",
                Authorization: "Bearer " + DROPBOX_TOKEN,
                "Dropbox-API-Arg":
                    '{"path": "/getprint/' +
                    file +
                    '","mode": "add","autorename": true,"mute": false,"strict_conflict": false}',
            },
            data: fs.readFileSync(
                path.join(__dirname + "./../../public/file4print/" + file)
            ),
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
