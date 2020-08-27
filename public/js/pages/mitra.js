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
    } else {
        $("#submit-form").prop("disabled", false);
    }
});

app.controller("menjadimitraCtrl", [
    "$scope",
    "$http",
    "$window",
    async function ($scope, $http, $window) {
        //initial liff
        try {
            await liffInit(liff);
            await liffApp();
        } catch (error) {
            alert(error.error);
        }

        //validation no hp is exist
        $scope.isExistNoHP = false;
        $scope.$watch("data.no_hp", () => {
            $scope.isExistNoHP = false;
        });

        //validation email is exist
        $scope.isExistEmail = false;
        $scope.$watch("data.email", () => {
            $scope.isExistEmail = false;
        });

        const file = [];
        $scope.listFile = (e, files) => {
            var id = e.id.charAt(e.id.length - 1);
            file[id - 1] = files[0];
        };

        $scope.submitForm = async () => {
            $("#progress-layout").html(`   
                <div class="progress" style="margin-top: 20px; margin-bottom:20px" id="progress">
                    <div class="progress-bar" role="progressbar" " aria-valuemin="0" aria-valuemax="100">0%</div>
                </div>
            `);

            $("#submit-form").prop("disabled", true);
            $("#addForm").prop("disabled", true);
            const progress_bar = document.getElementsByClassName(
                "progress-bar"
            )[0];

            let dataMitra;
            let dataFoto;

            try {
                dataMitra = await $http({
                    method: "POST",
                    url: "/api/mitra",
                    headers: {
                        Authorization: `Bearer ${user.idToken}`,
                    },
                    data: $scope.data,
                });
            } catch (error) {
                const keysErrors = Object.keys(error.data.error.errors);
                keysErrors.forEach((data) => {
                    if (data === "no_hp") {
                        $scope.$apply(() => {
                            $scope.isExistNoHP = true;
                        });
                    }

                    if (data === "email") {
                        $scope.$apply(() => {
                            $scope.isExistEmail = true;
                        });
                    }
                });

                $("#progress-layout").html(`
                    <p style="color:red;text-align: center;">FILE gagal terupload!</p>
                `);
                $("#submit-form").prop("disabled", false);
                $("#addForm").prop("disabled", false);

                return;
            }

            var fd = new FormData();
            for (i = 0; i < file.length; i++) {
                fd.append("mitraFoto", file[i]);
            }
            //userid_line untuk auth
            fd.append("mitra_id", dataMitra.data.data._id);

            try {
                dataFoto = await $http({
                    method: "POST",
                    url: "/api/fotomitra",
                    uploadEventHandlers: {
                        progress: (e) => {
                            const percent = e.lengthComputable
                                ? (e.loaded / e.total) * 100
                                : 0;

                            if (percent < 98) {
                                progress_bar.style.width =
                                    percent.toFixed(2) + "%";
                                progress_bar.textContent =
                                    percent.toFixed(2) + "%";
                            }
                        },
                    },
                    data: fd,
                    transformRequest: angular.identity,
                    headers: {
                        "Content-Type": undefined,
                        Authorization: `Bearer ${user.idToken}`,
                    },
                });
            } catch (error) {
                $("#progress-layout").html(`
                    <p style="color:red;text-align: center;">FILE gagal terupload!</p>
                `);
                $("#submit-form").prop("disabled", false);
                $("#addForm").prop("disabled", false);
                alert("Try again to upload file");
                return;
            }

            $window.alert(dataMitra.data.message);
            sendToWa(dataMitra.data.data);
            $window.location.href = "/";
        };
    },
]);

const sendToWa = (data) => {
    let nohpID = "6289635639022";

    liff.openWindow({
        url: `https://api.whatsapp.com/send?phone=${nohpID}&text=*GETPRINT*%0A%0AHI%20admin%20saya%20sudah%20mendaftar%20menjadi%20mitra.%20tolong%20di%20verifikasi.%0A%0A*Detail%20Toko*%0AUser%20ID%20%3A%20${data.user_id}%0AID%20Toko%20%3A%20${data._id}%2C%0ANama%20Toko%20%3A%20${data.nama_toko}%2C`,
        external: true,
    });
};

const user = {};

const liffApp = async () => {
    if (!liff.isLoggedIn()) {
        liff.login();
        return;
    }

    let profile = liff.getDecodedIDToken();
    user["user_id"] = profile.sub;
    user["idToken"] = liff.getIDToken();

    try {
        const admin = await isAdmin(user.idToken);
    } catch (error) {
        let msg = error.error.responseJSON.error_description;
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
    let coords;
    let myLocation;

    try {
        myLocation = await getLocation();

        coords = new google.maps.LatLng(
            myLocation.latitude,
            myLocation.longitude
        );
        mapRender(google, coords);
    } catch (error) {
        alert(error.message);
        coords = new google.maps.LatLng(-0.789275, 113.921327);
        mapRender(google, defaulLatlng, defaulLatlng);
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
