const { default: Axios } = require("axios");

const { DROPBOX_TOKEN } = process.env;

const getSharedLink = (path) => {
    const promise = new Promise((resolve, reject) => {
        Axios({
            method: "POST",
            url:
                "https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + DROPBOX_TOKEN,
            },
            data: '{"path": "' + path + '"}',
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

module.exports = getSharedLink;
