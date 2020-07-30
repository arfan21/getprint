function getUrlParameter(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    var results = regex.exec(location.search);
    return results === null
        ? ""
        : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var app = angular.module("menjadimitra", []);

app.directive("customFileInput", [
    function () {
        let filenameArr = [];
        return {
            link: function ($scope, element, attrs) {
                element.on("change", function (evt) {
                    var files = evt.target.files;
                    var fromId = evt.target.id;
                    var id = fromId.charAt(fromId.length - 1);

                    filename = files[0].name;
                    if (filename.length > 9) {
                        filename = filename.substring(0, 9) + "...";
                    }
                    filenameArr[id - 1] = filename;
                });

                $("#upload-container-parent").on("change", () => {
                    for (i = 0; i <= filenameArr.length; i++) {
                        var id = "#filename" + (i + 1);
                        $(id).text(filenameArr[i]);
                    }
                });
            },
        };
    },
]);

$("body").on("change", () => {
    if ($("#file1").val().length == 0) {
        $("#submit-form").prop("disabled", true);
    }
});

app.controller("menjadimitraCtrl", [
    "$scope",
    "$http",
    "$window",
    async function ($scope, $http, $window) {
        //initial liff
        const callLiffInit = await liffInit(liff).then(
            (result) => {
                liffApp();
            },
            (err) => {
                alert(err);
            }
        );

        $scope.data = {};
        $scope.data.coords = {};
        //userid_line untuk auth
        $scope.data.userid_line = uidLine[0];
        const file = [];

        $scope.listFile = (e, files) => {
            var id = e.id.charAt(e.id.length - 1);
            file[id - 1] = files[0];
        };

        $scope.uploadFIle = () => {
            var fd = new FormData();
            for (i = 0; i < file.length; i++) {
                fd.append("mitraFoto", file[i]);
            }
            //userid_line untuk auth
            fd.append("userid_line", uidLine[0]);

            $("#progress-layout").html(`   
                <div class="progress" style="margin-top: 20px; margin-bottom:20px" id="progress">
                    <div class="progress-bar" role="progressbar" " aria-valuemin="0" aria-valuemax="100">0%</div>
                </div>
            `);

            $("#uploadBtn").prop("disabled", true);
            $("#addForm").prop("disabled", true);
            const progress_bar = document.getElementsByClassName(
                "progress-bar"
            )[0];

            $http({
                method: "POST",
                url: "/api/fotomitra",
                uploadEventHandlers: {
                    progress: (e) => {
                        const percent = e.lengthComputable
                            ? (e.loaded / e.total) * 100
                            : 0;

                        if (percent < 98) {
                            progress_bar.style.width = percent.toFixed(2) + "%";
                            progress_bar.textContent = percent.toFixed(2) + "%";
                        }
                    },
                },
                data: fd,
                transformRequest: angular.identity,
                headers: {
                    "Content-Type": undefined,
                    Authorization: `Bearer ${idToken[0]}`,
                },
            }).then(
                (result) => {
                    $("#progress-layout").html(`
                        <p style="color:#00FF00;text-align: center;">FILE terupload!</p>
                    `);
                    $("#submit-form").prop("disabled", false);

                    result = result.data;

                    $scope.data.id_foto = result.data._id;
                    $scope.submitform = function () {
                        $http({
                            method: "POST",
                            url: "/api/mitra",
                            headers: {
                                Authorization: `Bearer ${idToken[0]}`,
                            },
                            data: $scope.data,
                        }).then(
                            function successCallback(response) {
                                $window.alert(response.data.message);
                                sendToWa(response.data.data);
                                $window.location.href = "/";
                            },
                            (err) => {
                                alert(err.data.message);
                            }
                        );
                    };
                },
                (err) => {
                    $("#progress-layout").html(`
                        <p style="color:red;text-align: center;">FILE gagal terupload!</p>
                    `);
                    $("#uploadBtn").prop("disabled", false);
                    $("#addForm").prop("disabled", false);
                    alert("Try again to upload file");
                }
            );
        };
    },
]);

const sendToWa = (data) => {
    let nohpID = "6289635639022";

    liff.openWindow({
        url: `https://api.whatsapp.com/send?phone=${nohpID}&text=*GETPRINT*%0A%0AHI%20admin%20saya%20sudah%20mendaftar%20menjadi%20mitra.%20tolong%20di%20verifikasi.%0A%0A*Detail%20Toko*%0AUser%20ID%20%3A%20${data.userid_line_pemilik}%0AID%20Toko%20%3A%20${data._id}%2C%0ANama%20Toko%20%3A%20${data.nama_toko}%2C`,
        external: true,
    });
};

const uidLine = [];
const idToken = [];

const liffApp = async () => {
    if (!liff.isLoggedIn()) {
        liff.login();
        return;
    }

    let profile = liff.getDecodedIDToken();

    idToken[0] = liff.getIDToken();
    uidLine[0] = profile.sub;

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

    $("body").css("display", "block");
};

async function initMap() {
    const defaulLatlng = new google.maps.LatLng(-0.789275, 113.921327);

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

    if (!myLocation.status) {
        console.log(myLocation.error);
        alert(myLocation.error.message);
        mapRender(google, defaulLatlng, defaulLatlng);
    } else {
        const latlng = [
            new google.maps.LatLng(
                myLocation.coords.latitude,
                myLocation.coords.longitude
            ),
        ];

        mapRender(google, latlng[0]);
    }
}

const mapRender = (google, latlng) => {
    const defaulLatlng = new google.maps.LatLng(-0.789275, 113.921327);
    var zoom = 20;
    if (
        latlng.lat() == defaulLatlng.lat() &&
        latlng.lng() == defaulLatlng.lng()
    ) {
        var zoom = 5;
    }

    map = new google.maps.Map(document.getElementById("map"), {
        center: latlng,
        zoom: zoom,
        disableDefaultUI: true,
    });

    var geocoder = new google.maps.Geocoder();

    getLocationCenter(google, geocoder, map, latlng);

    $("<div/>").addClass("marker-centered").appendTo(map.getDiv());
    $("#default_latitude").val(latlng.lat()).trigger("input");
    $("#default_longitude").val(latlng.lng()).trigger("input");

    getAddress(geocoder, latlng);
};

const getLocationCenter = (google, geocoder, map, latlng) => {
    google.maps.event.addListener(map, "center_changed", function () {
        latlng = new google.maps.LatLng(
            map.getCenter().lat(),
            map.getCenter().lng()
        );

        $("#default_latitude").val(latlng.lat).trigger("input");
        $("#default_longitude").val(latlng.lng).trigger("input");

        getAddress(geocoder, latlng);
    });
};

const getAddress = (geocoder, latlng) => {
    geocoder.geocode({ location: latlng }, (result, status) => {
        if (status == "OK") {
            $("#address").val(result[0].formatted_address);
        }
    });
};

$("#saveLocation").on("click", () => {
    $("#fixAddress").val($("#address").val()).trigger("input");
});
