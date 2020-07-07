const liffInit = (liff) => {
    return new Promise((resolve, reject) => {
        fetch("/send-id")
            .then(function (reqResponse) {
                return reqResponse.json();
            })
            .then(function (jsonResponse) {
                myLiffId = jsonResponse.id;
                initLiff(myLiffId);
            })
            .catch(function (error) {
                reject({
                    success: false,
                    error: error,
                });
            });

        function initLiff(myLiffId) {
            liff.init({
                liffId: myLiffId,
            })
                .then(() => {
                    resolve({
                        success: true,
                    });
                })
                .catch((err) => {
                    reject({
                        success: false,
                        error: err,
                    });
                });
        }
    });
};
