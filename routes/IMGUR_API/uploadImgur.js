const fs = require("fs");
const path = require("path");
const { default: Axios } = require("axios");
const IMGUR_CLIENT_ID = "token";

const uploadImgur = (filename) => {
    const promise = new Promise((resolve, reject) => {
        Axios({
            method: "POST",
            url: "https://api.imgur.com/3/image",
            headers: {
                Authorization: IMGUR_CLIENT_ID,
            },
            data: fs.readFileSync(
                path.join(__dirname + "./../../public/assets/" + filename)
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

module.exports = uploadImgur;
