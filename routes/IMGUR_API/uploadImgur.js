const { default: Axios } = require("axios");
const IMGUR_CLIENT_ID = `Client-ID ${process.env.IMGUR_CLIENT_ID}`;

const uploadImgur = (file) => {
    const promise = new Promise((resolve, reject) => {
        Axios({
            method: "POST",
            url: "https://api.imgur.com/3/image",
            headers: {
                Authorization: IMGUR_CLIENT_ID,
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

module.exports = uploadImgur;
