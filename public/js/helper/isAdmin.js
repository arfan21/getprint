const isAdmin = (uidline, idToken) => {
    return new Promise((reslove, reject) => {
        $.ajax({
            method: "POST",
            url: "/api/admincheck",
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
            data: { userid_line: uidline },
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
