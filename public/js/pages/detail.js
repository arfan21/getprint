$("#detail-img").on("load", () => {
    $("#detail-img").css("display", "block");
});

var id = getUrlParameter("id");

function uidlineSama(uid, any) {
    for (i = 0; i < any.length; i++) {
        if (uid == any[i].user_id) {
            return true;
        }
    }
    return false;
}

function getReviewId(uid, any) {
    return any.map((data) => {
        if (uid === data.user_id) {
            return data._id;
        }
    });
}

if (id.length == 0) {
    window.location = "/pagenotfound.html";
}

var app = angular.module("detailmitra", []);
app.controller("appCtrl", [
    "$scope",
    "$http",
    "$window",
    async function ($scope, $http, $window) {
        let user_rating;

        try {
            await liffInit(liff);
            await liffApp();
        } catch (error) {
            alert(error.error);
        }

        try {
            const res = await $http.get(`/api/mitra/${id}`);

            $scope.$apply(() => {
                $scope.data = res.data.data[0];
            });

            if (liff.isLoggedIn()) {
                await adminMenu($scope, user.idToken);
            }

            user_rating = $scope.data.rating.user_rating;

            userRated(user.uidLine, user_rating);

            //menghapus loader
            removeLoaderList(0);
        } catch (error) {
            $window.location = "/pagenotfound.html";
        }

        $scope.resetRating = () => {
            $scope.data.value_rating = null;
        };

        $scope.updateRating = async () => {
            if (uidlineSama(user.uidLine, user_rating)) {
                const reviewId = getReviewId(user.uidLine, user_rating);
                try {
                    const dataUpdate = {
                        rating_user: $scope.data.value_rating,
                    };
                    await $http.put(`/api/reviews/${reviewId}`, dataUpdate, {
                        headers: {
                            Authorization: `Bearer ${user.idToken}`,
                        },
                    });
                    $scope.$apply(() => {
                        $scope.data.value_rating = null;
                    });
                    location.reload();
                } catch (error) {}
            } else {
                const dataNew = {
                    mitra_id: $scope.data._id,
                    rating_user: $scope.data.value_rating,
                };
                await $http.post(`/api/reviews`, dataNew, {
                    headers: {
                        Authorization: `Bearer ${user.idToken}`,
                    },
                });
                $scope.data.value_rating = null;
                location.reload();
            }
        };

        $scope.deleteFunc = async () => {
            try {
                await $http.delete(`/api/mitra/${id}`, {
                    headers: {
                        "Content-Type": "application/json;charset=utf-8",
                        Authorization: `Bearer ${user.idToken}`,
                    },
                });

                $("#exampleModalLongTitle").text("Mitra berhasil terhapus !");
                $("#deleteBtn").css("display", "none");
                $("#batalBtn").removeClass("btn-secondary");
                $("#batalBtn").addClass("btn-primary");
                $("#batalBtn").text("Ok");
                $("#batalBtn").removeAttr("data-dismiss");
                $("#batalBtn").attr("href", "/");
                $(".close").css("display", "none");
            } catch (error) {
                alert(error.data.error);
            }
        };
    },
]);

const user = {};

const liffApp = async () => {
    if (!liff.isLoggedIn()) {
        $(".pesan").on("click", () => {
            liff.login();
        });
        $("#rating-open").on("click", () => {
            liff.login();
        });
        return;
    }

    let profile = liff.getDecodedIDToken();
    user["uidLine"] = profile.sub;
    user["idToken"] = liff.getIDToken();

    //membuka modal rating
    $("#rating-open").attr("data-toggle", "modal");
    $("#rating-open").attr("data-target", "#exampleModalCenterRating");

    $(".pesan").on("click", () => {
        window.location = `/pesanan.html?id=${id}`;
    });
};

const userRated = (uidline, user_rating) => {
    for (i = 0; i < user_rating.length; i++) {
        if (uidline == user_rating[i].user_id) {
            $(".rating-title").text("Mau mengubah rating anda ?");

            $(".modal-rating-content").append(
                `
                    <div class="modal-body">
                        <span>Bintang Sebelumnya : </span>
                        <span class="fa fa-star" id="rating-user" style="font-size:25px;"></span>
                        <span>${user_rating[i].rating_user}</span>
                    </div>
                `
            );
            if (user_rating[i].rating_user == 5) {
                $("#rating-user").css("color", "#14892c");
            } else if (user_rating[i].rating_user == 4) {
                $("#rating-user").css("color", "#3f9e37");
            } else if (user_rating[i].rating_user == 3) {
                $("#rating-user").css("color", "#f90");
            } else if (user_rating[i].rating_user == 2) {
                $("#rating-user").css("color", "#ff6c35");
            } else if (user_rating[i].rating_user == 1) {
                $("#rating-user").css("color", "#ff5254");
            }
        }
    }
};

//admin menu untuk mengubah dan menghapus toko
async function adminMenu($scope, idToken) {
    try {
        const admin = await isAdmin(idToken);

        if (admin.admin || user.uidLine == $scope.data.user_id) {
            $(".getprint-round-navbar").append(
                `
                <h4 class="detail-admin-menu" style="display: inline;margin-left: 5%;">
                    <a class="fa fa-pencil" href="/editmitra.html?id=${$scope.data._id}"></a>
                    <a class="fa fa-trash" data-toggle="modal" data-target="#exampleModalCenter" ></a>
                </h4>
            `
            );
        }
    } catch (error) {
        let msg = error.error.responseJSON.error_description;
        if (msg == "IdToken expired.") {
            alert("Sesi anda telah habis, silahkan login kembali");
            liff.logout();
            window.location.reload();
        }
        return;
    }
}

function removeLoaderList(i) {
    if ($(".loadingList").length == 1) {
        i = 0;
    }

    $($(".loadingList")[i]).fadeOut(500, function () {
        // fadeOut complete. Remove the loading div
        $($(".loadingList")[i]).remove(); //makes page more lightweight
    });
    $(".getprint-white-container").css("display", "block");
}
