$("#detail-img").on("load", () => {
    $("#detail-img").css("display", "block");
});

var id = getUrlParameter("id");

function uidlineSama(uid, any) {
    for (i = 0; i < any.length; i++) {
        if (uid == any[i].userid_line) {
            return true;
        }
    }
    return false;
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
        $scope.data = {};
        const callLiffInit = await liffInit(liff).then(
            (result) => {
                liffApp();
            },
            (err) => {
                alert(err);
            }
        );

        $http({
            method: "GET",
            url: `/api/mitra/${id}`,
        }).then(
            async (result) => {
                $scope.data = result.data.mitra[0];
                if (!result.data.status) {
                    $window.location = "/pagenotfound.html";
                } else {
                    await adminMenu($scope, uidLine[0]);
                    let user_rating = $scope.data.rating.user_rating;
                    userRated(uidLine[0], user_rating);

                    removeLoader();
                }
            },
            (err) => {
                $window.location = "/pagenotfound.html";
            }
        );

        $scope.resetRating = () => {
            $scope.data.value_rating = null;
        };

        $scope.updateRating = () => {
            var point = parseInt($scope.data.value_rating, 10);
            var user_rating = $scope.data.rating.user_rating;
            var total_point = $scope.data.rating.total_point;
            if (uidlineSama(uidLine[0], user_rating)) {
                total_point = total_point - user_rating[i].rating_user;

                user_rating[i].rating_user = point;

                $scope.data.rating.total_point = total_point + point;

                $scope.data.rating.avg_point =
                    $scope.data.rating.total_point /
                    $scope.data.rating.total_rating;

                $scope.data.rating.avg_point = $scope.data.rating.avg_point.toFixed(
                    1
                );
            } else {
                $scope.data.rating.total_point =
                    $scope.data.rating.total_point + point;
                $scope.data.rating.total_rating =
                    $scope.data.rating.total_rating + 1;
                $scope.data.rating.avg_point =
                    $scope.data.rating.total_point /
                    $scope.data.rating.total_rating;
                $scope.data.rating.avg_point = $scope.data.rating.avg_point.toFixed(
                    1
                );
                user_rating.push({
                    userid_line: uidLine[0],
                    rating_user: point,
                });
            }

            $http({
                method: "PUT",
                url: "/api/mitra/" + id,
                data: $scope.data,
            }).then(function successCallback(response) {
                $scope.data.value_rating = null;
                location.reload();
            });
        };

        $scope.deleteFunc = async () => {
            await $http({
                method: "DELETE",
                url: "/api/uploadfotomitra/" + $scope.data.fotomitra[0]._id,
            });

            $http({
                method: "DELETE",
                url: "/api/mitra/" + id,
            }).then(function successCallback(response) {
                $("#exampleModalLongTitle").text("Mitra berhasil terhapus !");
                $("#deleteBtn").css("display", "none");
                $("#batalBtn").removeClass("btn-secondary");
                $("#batalBtn").addClass("btn-primary");
                $("#batalBtn").text("Ok");
                $("#batalBtn").removeAttr("data-dismiss");
                $("#batalBtn").attr("href", "/");
                $(".close").css("display", "none");
            });
        };
    },
]);

const uidLine = [];

const liffApp = () => {
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
    uidLine[0] = profile.sub;

    $("#rating-open").attr("data-toggle", "modal");
    $("#rating-open").attr("data-target", "#exampleModalCenterRating");

    $(".pesan").on("click", () => {
        if (liff.isInClient()) {
            liff.openWindow({
                url: `https://977bcfa13438.ngrok.io/pesanan.html?id=${id}`,
                external: true,
            });
        } else {
            window.location = `/pesanan.html?id=${id}`;
        }
    });
};

const userRated = (uidline, user_rating) => {
    for (i = 0; i < user_rating.length; i++) {
        if (uidline == user_rating[i].userid_line) {
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

const adminMenu = async ($scope, uidline) => {
    const admin = await isAdmin(uidline).then(
        (result) => {
            return result;
        },
        (err) => {
            return err;
        }
    );

    if (!admin.success) {
        alert(admin.err);
        return;
    }

    if (admin.admin) {
        $(".getprint-round-navbar").append(
            `
            <h4 class="detail-admin-menu" style="display: inline;margin-left: 5%;">
                <a class="fa fa-pencil" href="/editmitra.html?id=${$scope.data._id}"></a>
                <a class="fa fa-trash" data-toggle="modal" data-target="#exampleModalCenter" ></a>
            </h4>
        `
        );
    }
};

function removeLoader() {
    $("#loadingDiv").fadeOut(500, function () {
        // fadeOut complete. Remove the loading div
        $("#loadingDiv").remove(); //makes page more lightweight
    });
}
