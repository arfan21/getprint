var app = angular.module("myApp", []);

const $http = angular.injector(["ng"]).get("$http");

app.controller("appCtrl", [
    "$scope",
    "$http",
    "$window",
    async function ($scope, $http, $window) {
        try {
            await liffInit(liff);
            await liffApp();
        } catch (error) {
            alert(error.error);
        }

        let coords;
        let myLocation;

        try {
            myLocation = await getLocation();

            coords = new google.maps.LatLng(
                myLocation.latitude,
                myLocation.longitude
            );
        } catch (error) {
            alert(error.message);
            coords = new google.maps.LatLng(-0.789275, 113.921327);
        }

        //data mitra berdasarkan rating terbaik
        try {
            const res = await $http.get("/api/mitra?sort=rating");

            $scope.$apply(() => {
                $scope.databyrating = res.data.data;
            });

            setTimeout(() => {
                printDistance($scope.databyrating, coords, google);
            }, 1);
            if (user.uidLine) {
                await printFollowingMitra(user.idToken, user.uidLine);
            }
            $(".btn-link").trigger("button");
        } catch (error) {
            $scope.$apply(() => {
                $scope.databyrating = [];
            });
        }

        //data mitra terbaru
        $scope.getDataByDate = async () => {
            if ($scope.databydate) {
                return;
            }
            try {
                const res = await $http.get("/api/mitra?sort=created_at");
                $scope.$apply(() => {
                    $scope.databydate = res.data.data;
                });

                if (user.uidLine) {
                    await printFollowingMitra(user.idToken, user.uidLine);
                }
                printDistance($scope.databydate, coords, google);
                removeLoaderList(0);
            } catch (error) {
                $scope.$apply(() => {
                    $scope.databydate = [];
                });
            }
        };

        //data mitra berdasarkan jarak terdekat
        $scope.getDataByDistance = async () => {
            if ($scope.data) {
                return;
            }
            try {
                const res = await $http.get("/api/mitra");

                let data = res.data.data;

                for (i = 0; i < data.length; i++) {
                    let mitraLatLng = new google.maps.LatLng(
                        data[i].coords.lat,
                        data[i].coords.lng
                    );

                    let distance = getDistance(google, coords, mitraLatLng);

                    data[i].distance = distance;
                }

                data.sort((a, b) => {
                    return a.distance - b.distance;
                });

                //print data
                $scope.$apply(() => {
                    $scope.data = data;
                });

                setTimeout(async () => {
                    if (user.uidLine != undefined) {
                        await printFollowingMitra(user.idToken, user.uidLine);
                    }
                    printDistance($scope.data, coords, google);
                    removeLoaderList(1);
                }, 1);
            } catch (error) {
                $scope.$apply(() => {
                    $scope.data = [];
                });
            }
        };

        removeLoader();
    },
]);

//untuk menampilkan jarak, jika user tidak mengaktifkan gps maka tidak akan ditampilkan jarak
const printDistance = (data, myLatLng, google) => {
    for (i = 0; i < data.length; i++) {
        let mitraLatLng = new google.maps.LatLng(
            data[i].coords.lat,
            data[i].coords.lng
        );
        let distance = getDistance(google, myLatLng, mitraLatLng);

        if (distance != -1) {
            $(`.${data[i].fotomitra[0]._id}`).text(`${distance} km`);
        }
    }
};

const printFollowingMitra = async (idToken, userId) => {
    try {
        const res = await $http({
            method: "GET",
            url: `/api/followmitra?user_id=${userId}`,
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
        });

        let followed = res.data.data;

        for (i = 0; i < followed.length; i++) {
            let classFollowing = followed[i].mitra_id;
            $("." + classFollowing).removeClass("fa-heart-o");
            $("." + classFollowing).addClass("fa-heart");
            $("." + classFollowing).addClass(followed[i]._id);
            $("." + followed[i]._id).removeClass(classFollowing);
        }
    } catch (error) {}
};

//fungsi untuk memfollow mitra
async function follow(obj) {
    let classObj = $(obj).attr("class");
    let className = classObj.split(" ");
    let id = className[className.length - 1];

    let useridline = user.uidLine;
    if (useridline == undefined) {
        liff.login();
        return;
    }
    if (id == undefined) {
        return;
    }

    try {
        if ($("." + id).hasClass("fa-heart")) {
            if (id != "fa-heart") {
                $("." + id).toggleClass("fa-heart fa-heart-o");
                const res = await $http({
                    method: "DELETE",
                    url: `/api/followmitra/${id}`,
                    headers: {
                        Authorization: `Bearer ${user.idToken}`,
                    },
                });

                let idbaru = res.data.data.mitra_id;
                $("." + id).addClass(idbaru);
                $("." + idbaru).removeClass(id);
            }
        } else if ($("." + id).hasClass("fa-heart-o")) {
            let data = {
                mitra_id: id,
            };

            if (id != "fa-heart-o") {
                $("." + id).toggleClass("fa-heart-o fa-heart");
                const res = await $http({
                    method: "POST",
                    url: "/api/followmitra/",
                    headers: {
                        Authorization: `Bearer ${user.idToken}`,
                    },
                    data: data,
                });

                let idBaru = res.data.data._id;
                $("." + id).addClass(idBaru);
                $("." + idBaru).removeClass(id);
            }
        }
    } catch (error) {}
}

async function liffApp() {
    await checkIsInClient();
    App();
}

//mengecek user apakah menggunakan line browser atau external browser
async function checkIsInClient() {
    if (!liff.isInClient()) {
        alert("You are opening the app in an external browser.");

        //jika menggunakan line browser akan muncul tombol login dan logout
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

const user = {};

const App = async () => {
    if (liff.isLoggedIn()) {
        let profile = liff.getDecodedIDToken();

        const profileName = profile.name;
        const linkProfilePicture = profile.picture;
        user["uidLine"] = profile.sub;
        user["idToken"] = liff.getIDToken();

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

        await adminMenu(user.idToken);
    } else {
        $(".fa-heart-o").click(() => {
            liff.login();
        });
    }
};

//admin menu untuk menambah mitra baru
async function adminMenu(idToken) {
    try {
        const admin = await isAdmin(idToken);

        if (admin.admin) {
            $("#adminMenu").html(
                `
                    <div id="addnewmitra" style="text-align: right;">
                        <a  
                            id="loginLine" 
                            style="color:black;cursor:pointer"
                            href="addnewmitra.html">Add New Mitra</a>
                    </div>
                    
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

const getDistance = (google, from, to) => {
    let coords = new google.maps.LatLng(-0.789275, 113.921327);
    if (from.lat() == coords.lat() && from.lng() == coords.lng()) {
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

function removeLoaderList(i) {
    if ($(".loadingList").length == 1) {
        i = 0;
    }

    $($(".loadingList")[i]).fadeOut(500, function () {
        // fadeOut complete. Remove the loading div
        $($(".loadingList")[i]).remove(); //makes page more lightweight
    });
}
