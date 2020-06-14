function getUrlParameter(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    var results = regex.exec(location.search);
    return results === null
        ? ""
        : decodeURIComponent(results[1].replace(/\+/g, " "));
}
var id = getUrlParameter("id");
var uidline = getUrlParameter("useridline");

var link = document.getElementById("link").href;
document.getElementById("link").href = link + "&useridline=" + uidline;

function uidlineSama(uid, any) {
    for (i = 0; i < any.length; i++) {
        if (uid == any[i].userid_line) {
            return true;
        }
    }
    return false;
}

if (uidline.length == 0) {
    $("#link").attr("data-target", "#exampleModalCenterRating");
    $("#link").attr("data-toggle", "modal");
    $("#link").on("click", () => {
        $("#rating-bar").html(`
            <h3>Untuk melakukan pemesanan harus melalui LINE</h3>
        `);
    });
    $("#rating-open").on("click", () => {
        $("#rating-bar").html(`
        <h3>Memberi Rating harus melalui LINE</h3>
        `);
    });

    $(".rating-title").text("");
    $(".star-rating").remove();

    $("#submitRating").remove();
    $("#batalBtnRating").removeClass("btn-secondary");
    $("#batalBtnRating").addClass("btn-primary");
    $("#batalBtnRating").text("Ok");
}

var app = angular.module("detailmitra", []);
app.controller("appCtrl", [
    "$scope",
    "$http",
    "$window",
    function ($scope, $http, $window) {
        $http({
            method: "GET",
            url: "/api/mitra/" + id,
        }).then(function successCallback(response) {
            $scope.data = response.data.mitra[0];

            if (!response.data.status) {
                $window.location = "/pagenotfound.html";
            } else {
                if (uidline == "U806e7bec3288e9572243e079aa7b6b16") {
                    $(".getprint-round-navbar").append(
                        `
                    <div class="detail-admin-menu">
                        <a class="fa fa-pencil" href="/editmitra.html?id=` +
                            $scope.data._id +
                            `&useridline=U806e7bec3288e9572243e079aa7b6b16&linkfoto=` +
                            $scope.data.link_foto +
                            `"></a>
                        <a class="fa fa-trash" data-toggle="modal" data-target="#exampleModalCenter" ></a>
                    </h3>
                `
                    );
                }

                let user_rating = $scope.data.rating.user_rating;

                for (i = 0; i < user_rating.length; i++) {
                    if (uidline == user_rating[i].userid_line) {
                        $(".rating-title").text("Mau mengubah rating anda ?");
                        console.log(user_rating[i].rating_user);
                        $scope.data.value_rating = user_rating[i].rating_user;
                        $(".modal-rating-content").append(
                            `
                        <div class="modal-body">
                            <span>Bintang Sebelumnya : </span>
                            <span class="fa fa-star" id="rating-user" style="font-size:25px;"></span>
                            <span>` +
                                user_rating[i].rating_user +
                                `</span>
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
            }
        });

        $scope.resetRating = () => {
            $scope.data.value_rating = null;
        };

        $scope.updateRating = () => {
            var point = parseInt($scope.data.value_rating, 10);

            let user_rating = $scope.data.rating.user_rating;

            if (uidlineSama(uidline, user_rating)) {
                $scope.data.rating.total_point =
                    $scope.data.rating.total_point - user_rating[i].rating_user;
                user_rating[i].rating_user = point;
                $scope.data.rating.total_point =
                    $scope.data.rating.total_point + point;
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
                    userid_line: uidline,
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

        $scope.deleteFunc = () => {
            $http({
                method: "DELETE",
                url:
                    "https://api.imgur.com/3/image/" +
                    $scope.data.deleteHash_foto,
                headers: { Authorization: "Client-ID f4a9a61acd375d4" },
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
