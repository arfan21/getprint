var app = angular.module("myApp", []);
app.controller("appCtrl", [
    "$scope",
    "$http",
    "$window",
    async function ($scope, $http, $window) {
        const myLocation = await getLocation().then(
            (result) => {
                return {
                    status: true,
                    coords: result,
                };
            },
            (err) => {
                return {
                    status: false,
                    error: err,
                };
            }
        );

        const myLatLng = [];

        if (!myLocation.status) {
            alert(myLocation.error.message);
            myLatLng[0] = new google.maps.LatLng(-0.789275, 113.921327);
        } else {
            myLatLng[0] = new google.maps.LatLng(
                myLocation.coords.latitude,
                myLocation.coords.longitude
            );
        }

        const callLiffInit = await liffInit(liff).then(
            (result) => {
                liffApp();
            },
            (err) => {
                alert(err.error);
            }
        );

        await $http({
            method: "GET",
            url: "/api/followingmitra/" + uidLine[0],
        }).then(
            async (response) => {
                $scope.followed = response.data.followingdata;
                let dataToko = [];
                if (response.status) {
                    for (i = 0; i < $scope.followed.length; i++) {
                        let idToko = response.data.followingdata[i].id_toko;
                        let toko = await getToko($http, idToko).then(
                            (result) => {
                                return result;
                            },
                            (err) => {
                                $.ajax({
                                    method: "DELETE",
                                    url:
                                        "/api/followingmitra/" +
                                        response.data.followingdata[i]._id,
                                });
                                console.log(response.data.followingdata[i]._id);
                                console.log(err);
                                return null;
                            }
                        );

                        if (toko != null) {
                            dataToko.push(toko);
                        }
                    }
                    $scope.data = dataToko;

                    $("body").css("display", "block");

                    if ($scope.data.length == 0) {
                        $("container-following").html(`
                            <h1>Anda belum mengikuti toko manapun</h1>
                        `);
                    }
                }
            },
            (err) => {
                $("body").css("display", "block");
                $("#container-following").html(`
                <h1>Anda belum mengikuti toko manapun</h1>
            `);
            }
        );

        $("#heart-body").attr("data-useridline", uidLine[0]);

        if ($scope.data != undefined) {
            for (i = 0; i < $scope.data.length; i++) {
                let classFollowing = $scope.data[i]._id;

                $("." + classFollowing).removeClass("fa-heart-o");
                $("." + classFollowing).addClass("fa-heart");
                $("." + classFollowing).addClass($scope.followed[i]._id);
                $("." + $scope.followed[i]._id).removeClass(classFollowing);
            }
        }

        $scope.unfollow = unfollow;
    },
]);

const getToko = ($http, id) => {
    return new Promise((resolve, reject) => {
        $http({
            method: "GET",
            url: `/api/mitra/${id}`,
        }).then(
            (result) => {
                if (result.data.status) {
                    resolve(result.data.mitra[0]);
                }
            },
            (err) => {
                reject(err.data);
            }
        );
    });
};

function unfollow(array, index) {
    let classNameEvent = event.srcElement.className;
    let classNameObj = classNameEvent.split(" ");
    let id = classNameObj[classNameObj.length - 1];

    let useridline = $("#heart-body").data("useridline");

    if (useridline == undefined) {
        return;
    }

    if ($("." + id).hasClass("fa-heart")) {
        $("." + id).removeClass("fa-heart");
        $("." + id).addClass("fa-heart-o");

        array.splice(index, 1);

        if (array.length == 0) {
            $("body").css("display", "block");
            $("container-following").html(`
                <h1>Anda belum mengikuti toko manapun</h1>
            `);
        }

        $.ajax({
            method: "DELETE",
            url: "/api/followingmitra/" + id,
            success: function (response) {
                let idbaru = response.followingdata.id_toko;
                $("." + id).addClass(idbaru);
                $("." + idbaru).removeClass(id);
            },
        });
    }
}

async function liffApp() {
    App();
}

const uidLine = [];

const App = async () => {
    if (liff.isLoggedIn()) {
        let profile = liff.getDecodedIDToken();

        const profileName = profile.name;
        const linkProfilePicture = profile.picture;
        uidLine[0] = profile.sub;

        $("#welcome-message #profileName").html(
            `
            <img src="` +
                linkProfilePicture +
                `" alt="Profile-Picture" style="width: 40px;height: 40px;border-radius: 50%;">
            <h2 style="margin: 0px 0px 0px 10px;">` +
                profileName +
                `</h2>
        `
        );

        await $("#welcome-message #profileName").css(
            "display",
            "-webkit-inline-box"
        );
    } else {
        liff.login();
    }
};

const getDistance = (google, from, to) => {
    const myLatLng = [];
    myLatLng[0] = new google.maps.LatLng(-0.789275, 113.921327);
    if (from.lat() == myLatLng[0].lat() && from.lng() == myLatLng[0].lng()) {
        return -1;
    }
    return (
        google.maps.geometry.spherical.computeDistanceBetween(
            from,

            to
        ) / 1000
    ).toFixed(2);
};
