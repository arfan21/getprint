const { default: Axios } = require("axios");
const IMGUR_CLIENT_ID = "token";

const deleteFotoImgur = (deleteHash) => {
    const promise = new Promise((resolve, reject) => {
        Axios({
            method: "DELETE",
            url: "https://api.imgur.com/3/image/" + deleteHash,
            headers: {
                Authorization: IMGUR_CLIENT_ID,
            },
        }).then(
            (result) => {
                resolve(result);
            },
            (err) => {
                reject(err);
            }
        );
    });

    return promise;
};

module.exports = deleteFotoImgur;
