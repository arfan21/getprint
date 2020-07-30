const Files = require("../../models/Files");
const uploadDropbox = require("./DROPBOX_API/uploadDropbox");
const getSharedLink = require("./DROPBOX_API/getSharedLink");

const saveFiles = (files) => {
    return new Promise(async (resolve, reject) => {
        const newSharedLink = [];

        for (i = 0; i < files.length; i++) {
            let file = files[i];

            const fileFromDropBox = await uploadDropbox(file).then(
                (result) => {
                    return {
                        success: true,
                        result: result,
                    };
                },
                (err) => {
                    return {
                        success: false,
                        error: err,
                    };
                }
            );

            if (!fileFromDropBox.success) {
                reject({
                    success: false,
                    data: fileFromDropBox.error,
                });
                return;
            }

            const path_display = fileFromDropBox.result.path_display;

            const sharedLink = await getSharedLink(path_display).then(
                (result) => {
                    return {
                        success: true,
                        result: result,
                    };
                },
                (err) => {
                    return {
                        success: false,
                        error: err,
                    };
                }
            );

            if (!sharedLink.success) {
                reject({
                    success: false,
                    data: sharedLink.error,
                });
                return;
            }

            newSharedLink.push(sharedLink.result.url);
        }

        const newUpload = new Files({
            link_file: newSharedLink,
        });

        newUpload
            .save()
            .then((data) => {
                resolve({
                    success: true,
                    data: data,
                });
            })
            .catch((err) => {
                reject({
                    success: false,
                    data: err,
                });
            });
    });
};

module.exports = {
    saveFiles: saveFiles,
};
