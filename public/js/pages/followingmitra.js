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
            url: `/api/followmitra?match=userid_line&userid_line=${user.uidLine}`,
            headers: {
                Authorization: `Bearer ${user.idToken}`,
            },
        }).then(
            async (response) => {
                    $scope.followed = response.data.data;
                    let dataToko = [];
                    if (response.status) {
                        for (i = 0; i < $scope.followed.length; i++) {
                            let idToko = response.data.data[i].id_toko;
                            let toko = await getToko($http, idToko).then(
                                (result) => {
                                    return result;
                                },
                                (err) => {
                                    $http.delete(
                                        `/api/followmitra/${response.data.data[i]._id}`, {
                                            data: {
                                                userid_line: user.uidLine,
                                            },
                                            headers: {
                                                "Content-Type": "application/json;charset=utf-8",
                                                Authorization: `Bearer ${user.idToken}`,
                                            },
                                        }
                                    );

                                    return null;
                                }
                            );

                            if (toko != null) {
                                dataToko.push(toko);
                            }
                        }

                        if (dataToko.length == 0) {
                            $("#container-following").html(`
                                <div id="not-found" class="text-center container">
                                    <img src="./assets/banner-404.png" alt="...">
                                    <br>
                                    <p>Maaf, kami tidak bisa menemukan mitra yang anda ikuti.</p>
                                    <a href="/" class="btn btn-primary">BACK</a>
                                </div>
                            `);
                        }
                        $scope.data = dataToko;
                        removeLoaderList(0)
                    }
                },
                (err) => {
                    $("body").css("display", "block");
                    $("#container-following").html(`
                        <div id="not-found" class="text-center container">
                            <img src="./assets/banner-404.png" alt="...">
                            <br>
                            <p>Maaf, kami tidak bisa menemukan mitra yang anda ikuti.</p>
                            <a href="/" class="btn btn-primary">BACK</a>
                        </div>
                    `);
                }
        );

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
                    resolve(result.data.data[0]);
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

    if ($("." + id).hasClass("fa-heart")) {
        $("." + id).removeClass("fa-heart");
        $("." + id).addClass("fa-heart-o");

        array.splice(index, 1);
        if (array.length == 0) {
            $("#container-following").html(`
                <div id="not-found" class="text-center container">
                    <img src="./assets/banner-404.png" alt="...">
                    <br>
                    <p>Maaf, kami tidak bisa menemukan mitra yang anda ikuti.</p>
                    <a href="/" class="btn btn-primary">BACK</a>
                </div>
            `);
        }

        $.ajax({
            method: "DELETE",
            url: `/api/followmitra/${id}`,
            data: {
                userid_line: user.uidLine,
            },
            headers: {
                Authorization: `Bearer ${user.idToken}`,
            },

            success: function (response) {
                let idbaru = response.data.id_toko;
                $("." + id).addClass(idbaru);
                $("." + idbaru).removeClass(id);
            },
        });
    }
}

async function liffApp() {
    App();
}

const user = {};

const App = async () => {
    if (liff.isLoggedIn()) {
        let profile = liff.getDecodedIDToken();

        user["uidLine"] = profile.sub;
        user["idToken"] = liff.getIDToken();
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

function removeLoaderList(i) {
    if ($(".loadingList").length == 1) {
        i = 0
    }

    $($(".loadingList")[i]).fadeOut(500, function () {
        // fadeOut complete. Remove the loading div
        $($(".loadingList")[i]).remove(); //makes page more lightweight
    });
}