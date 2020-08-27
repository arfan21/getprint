const Mitra = require("../../../models/Mitra");

module.exports = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const newMitra = new Mitra(data);
            const newData = await newMitra.save();

            resolve(newData);
        } catch (error) {
            reject(error);
        }
    });
};
