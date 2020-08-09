var app = angular.module("myApp", []);
const $http = angular.injector(["ng"]).get("$http");
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

        //mengecek user apakah mengaktifkan gps atau tidak
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
                url: `/api/mitrainactive`,
                headers: {
                    Authorization: `Bearer ${idToken[0]}`,
                },
            })
            .then((data) => {
                $scope.data = data.data.data;
            })
            .catch((err) => {
                if (err.data.error == "Mitra not found") {
                    $("#container-following").html(`
                        <div id="not-found" class="text-center container">
                            <img src="./assets/banner-404.png" alt="...">
                            <br>
                            <p>Maaf, belum ada mitra yang mendaftar.</p>
                            <a href="/" class="btn btn-primary">BACK</a>
                        </div>
                    `);
                } else {
                    alert(err.data.error);
                }
            });

        $scope.acceptBtn = acceptBtn;
        $scope.declineBtn = declineBtn;
        removeLoaderList(0);
    },
]);

const acceptBtn = (data, array, index) => {
    let dataMitra = data;
    dataMitra["userid_line"] = uidLine[0];
    dataMitra["status"] = "active";

    $http({
        method: "PUT",
        url: `/api/mitra/${dataMitra._id}`,
        headers: {
            Authorization: `Bearer ${idToken[0]}`,
        },
        data: dataMitra,
    }).then(function successCallback(response) {
        alert(response.data.message);
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
    });
};

const declineBtn = (data, array, index) => {
    let dataMitra = data;

    $http
        .delete(
            `/api/mitra/${dataMitra._id}?idFoto=${dataMitra.fotomitra[0]._id}&deleteHash=${dataMitra.fotomitra[0].deleteHash_foto}`, {
                data: {
                    userid_line: uidLine[0],
                },
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                    Authorization: `Bearer ${idToken[0]}`,
                },
            }
        )
        .then((result) => {
            alert(result.data.message);
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
        });
};

async function liffApp() {
    App();
}

const uidLine = [];
const idToken = [];

const App = async () => {
    if (liff.isLoggedIn()) {
        let profile = liff.getDecodedIDToken();

        uidLine[0] = profile.sub;
        idToken[0] = liff.getIDToken();

        const admin = await isAdmin(uidLine[0], idToken[0]).then(
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
                liff.logout();
                window.location.reload();
            }
            return;
        }

        if (!admin.admin) {
            window.location = "/pagenotfound.html";
        }
    } else {
        window.location = "/pagenotfound.html";
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