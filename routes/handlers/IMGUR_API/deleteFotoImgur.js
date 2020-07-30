const { default: Axios } = require("axios");
const IMGUR_CLIENT_ID = `Client-ID ${process.env.IMGUR_CLIENT_ID}`;

const deleteFotoImgur = (deleteHash) => {
    const promise = new Promise((resolve, reject) => {
        Axios({
            method: "DELETE",
            url: "https://api.imgur.com/3/image/" + deleteHash,
            headers: {
                Authorization: IMGUR_CLIENT_ID,
            },
        })
            .then((result) => {
                resolve(result);
            })
            .catch((err) => {
                reject(err.response.data.data.error);
            });
    });

    return promise;
};

module.exports = deleteFotoImgur;
