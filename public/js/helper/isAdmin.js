const isAdmin = (uidline) => {
    return new Promise((reslove, reject) => {
        $.ajax({
            method: "POST",
            url: "/api/admincheck",
            data: { uid: uidline },
            success: function (response) {
                reslove({
                    success: true,
                    admin: response.admin,
                });
            },
            error: (err) => {
                reject({
                    success: false,
                    error: err,
                });
            },
        });
    });
};
