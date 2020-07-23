var app = angular.module("myApp", []);
app.controller("appCtrl", [
    "$scope",
    "$http",
    "$window",
    async function ($scope, $http, $window) {
        const callLiffInit = await liffInit(liff).then(
            (result) => {
                liffApp();
            },
            (err) => {
                alert(err.error);
            }
        );

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

        await $http({
            method: "GET",
            url: "/api/mitra",
        }).then(function successCallback(response) {
            if (!response.data.status) {
                $scope.data = [];
                return;
            }

            let data = {};
            data = response.data.mitra;

            for (i = 0; i < data.length; i++) {
                let mitraLatLng = new google.maps.LatLng(
                    data[i].coords.lat,
                    data[i].coords.lng
                );
                let distance = getDistance(google, myLatLng[0], mitraLatLng);
                data[i].distance = distance;
            }
            data.sort((a, b) => {
                return a.distance - b.distance;
            });
            $scope.data = data;
        });

        await $http({
            method: "GET",
            url: "/api/mitra?sort=date",
        }).then(function successCallback(response) {
            $scope.databydate = response.data.mitra;
        });

        await $http({
            method: "GET",
            url: "/api/mitra?sort=rating",
        }).then(function successCallback(response) {
            $scope.databyrating = response.data.mitra;
        });

        if ($scope.data.length != 0) {
            printDistance($scope.data, myLatLng[0], google);
        }

        if (uidLine.length != 0) {
            await $http({
                method: "GET",
                url: "/api/followingmitra/" + uidLine[0],
                headers: {
                    Authorization: `Bearer ${idToken[0]}`,
                },
            }).then(
                (response) => {
                    let followed = response.data.followingdata;

                    if (response.status) {
                        for (i = 0; i < followed.length; i++) {
                            let classFollowing = followed[i].id_toko;
                            $("." + classFollowing).removeClass("fa-heart-o");
                            $("." + classFollowing).addClass("fa-heart");
                            $("." + classFollowing).addClass(followed[i]._id);
                            $("." + followed[i]._id).removeClass(
                                classFollowing
                            );
                        }
                    }
                },
                (err) => {}
            );
            $(".heart-body").attr("data-useridline", uidLine[0]);
        }

        removeLoader();
    },
]);

const printDistance = (data, myLatLng, google) => {
    for (i = 0; i < data.length; i++) {
        let mitraLatLng = new google.maps.LatLng(
            data[i].coords.lat,
            data[i].coords.lng
        );
        let distance = getDistance(google, myLatLng, mitraLatLng);

        if (distance != -1) {
            $(`.${data[i].id_foto}`).text(`${distance} km`);
        }
    }
};

var locked = false;

async function follow(obj) {
    let classObj = $(obj).attr("class");
    let className = classObj.split(" ");
    let id = className[className.length - 1];

    let useridline = $(".heart-body").data("useridline");
    if (useridline == undefined) {
        liff.login();
        return;
    }
    if (id == undefined) {
        return;
    }

    if ($("." + id).hasClass("fa-heart")) {
        if (id != "fa-heart") {
            $("." + id).toggleClass("fa-heart fa-heart-o");
            $.ajax({
                method: "DELETE",
                url: `/api/followingmitra/${id}`,
                data: {
                    userid_line: useridline,
                },
                headers: {
                    Authorization: `Bearer ${idToken[0]}`,
                },
                success: function (response) {
                    if (response.status) {
                        let idbaru = response.followingdata.id_toko;
                        $("." + id).addClass(idbaru);
                        $("." + idbaru).removeClass(id);
                    }
                },
            });
        }
    } else if ($("." + id).hasClass("fa-heart-o")) {
        let data = {
            id_toko: id,
            userid_line: useridline,
        };

        if (id != "fa-heart-o") {
            $("." + id).toggleClass("fa-heart-o fa-heart");
            $.ajax({
                method: "POST",
                url: "/api/followingmitra/",
                headers: {
                    Authorization: `Bearer ${idToken[0]}`,
                },
                data: data,
                success: function (response) {
                    if (response.status) {
                        let idBaru = response.followingdata._id;
                        $("." + id).addClass(idBaru);
                        $("." + idBaru).removeClass(id);
                    }
                },
            });
        }
    }
}

async function liffApp() {
    await checkIsInClient();
    App();
}

function checkIsInClient() {
    if (!liff.isInClient()) {
        alert("You are opening the app in an external browser.");
        if (!liff.isLoggedIn()) {
            $("#welcome-message").append(`
                <div style="width: 90%;text-align: right;">
                    <button id="loginLine" class="btn btn-primary">Login</button>
                </div>
                
            `);
            $("#loginLine").on("click", () => {
                liff.login();
            });
        } else {
            $("#welcome-message").append(`
                <div style="width: 30%;text-align: right;">
                    <button id="loginLine" class="btn btn-primary">Log Out</button>
                </div>
                
            `);
            $("#loginLine").on("click", () => {
                liff.logout();
                window.location.reload();
            });
        }
    } else {
        alert("Untuk melanjutkan, harap aktifkan device lokasi");
    }
}

const uidLine = [];
const idToken = [];

const App = async () => {
    if (liff.isLoggedIn()) {
        let profile = liff.getDecodedIDToken();

        const profileName = profile.name;
        const linkProfilePicture = profile.picture;
        uidLine[0] = profile.sub;
        idToken[0] = liff.getIDToken();

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

        await adminMenu(uidLine[0], idToken[0]);
    } else {
        $(".fa-heart-o").click(() => {
            liff.login();
        });
    }
};

async function adminMenu(userIDLine, idToken) {
    const admin = await isAdmin(userIDLine, idToken).then(
        (result) => {
            return result;
        },
        (err) => {
            return err;
        }
    );
    if (!admin.success) {
        let msg = admin.error.responseJSON.message;
        if (msg == "IdToken expired.") {
            alert("Sesi anda telah habis, silahkan login kembali");
            liff.login();
        }
        return;
    }
    if (admin.admin) {
        $("#adminMenu").html(
            `
                <div id="addnewmitra" style="text-align: right;">
                    <a  
                        id="loginLine" 
                        style="color:black;cursor:pointer"
                        href="mitra.html">Add New Mitra</a>
                </div>
                
            `
        );
    }
}

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

function removeLoader() {
    $("#loadingDiv").fadeOut(500, function () {
        // fadeOut complete. Remove the loading div
        $("#loadingDiv").remove(); //makes page more lightweight
    });
}
