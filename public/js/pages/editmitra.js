$("#fotoMitra").on("load", () => {
    $("#fotoMitra").css("display", "block");
});

function getUrlParameter(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    var results = regex.exec(location.search);
    return results === null
        ? ""
        : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var id = getUrlParameter("id");

if (id.length == 0) {
    window.location = "/pagenotfound.html";
}

const uploadForm = document.getElementById("uploadForm");
const inputFIle = document.getElementById("inputFile");

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

app.controller("menjadimitraCtrl", [
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
        let admin;
        try {
            admin = await isAdmin(user.idToken);
        } catch (error) {
            let msg = error.error.responseJSON.error_description;
            if (msg == "IdToken expired.") {
                alert("Sesi anda telah habis, silahkan login kembali");
                liff.logout();
                window.location.reload();
            }
            return;
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

        try {
            const res = await $http.get(`/api/mitra/${id}`);
            $scope.$apply(() => {
                $scope.data = res.data.data[0];
            });

            if (!admin.admin || user.uidLine != $scope.data.user_id) {
                window.location = "/pagenotfound.html";
            }
        } catch (error) {}

        //list file yang akan di upload
        const file = [];
        $scope.listFile = (e, files) => {
            var id = e.id.charAt(e.id.length - 1);
            file[id - 1] = files[0];
        };

        //fungsi untuk upload, menghapus file foto terdahulu lalu upload file foto yang terbaru
        $scope.uploadFIle = async () => {
            var fd = new FormData();
            for (i = 0; i < file.length; i++) {
                fd.append("mitraFoto", file[i]);
            }

            fd.append("mitra_id", $scope.data._id);

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

            try {
                $("#fotoMitra").css("display", "none");
                await $http.delete(
                    `/api/fotomitra/${$scope.data.fotomitra[0]._id}`,
                    {
                        headers: {
                            "Content-Type": "application/json;charset=utf-8",
                            Authorization: `Bearer ${user.idToken}`,
                        },
                    }
                );
                const updatedFoto = await $http({
                    method: "POST",
                    url: `/api/fotomitra`,
                    data: fd,
                    transformRequest: angular.identity,
                    headers: {
                        "Content-Type": undefined,
                        Authorization: `Bearer ${user.idToken}`,
                    },
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
                });

                $scope.$apply(() => {
                    $scope.data.fotomitra[0] = updatedFoto.data.data;
                });

                $("#progress-layout").html(`
                    <p style="color:#00FF00;text-align: center;">FILE terupload!</p>
                `);
                $("#fotoMitra").css("display", "block");
            } catch (error) {
                $("#progress-layout").html(`
                        <p style="color:#FF0000;text-align: center;">FILE GAGAL terupload!</p>
                    `);
                $("#uploadBtn").prop("disabled", false);
                $("#addForm").prop("disabled", false);
                alert("Try again to upload file");
            }
        };

        $scope.submitform = async () => {
            try {
                const updatedMitra = await $http({
                    method: "PUT",
                    url: `/api/mitra/${id}`,
                    headers: {
                        Authorization: `Bearer ${user.idToken}`,
                    },
                    data: $scope.data,
                });

                $window.alert(updatedMitra.data.message);
                $window.location.href = `/detail.html?id=${id}`;
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
            }
        };
        $("body").css("display", "block");
    },
]);

const user = {};

const liffApp = async () => {
    if (!liff.isLoggedIn()) {
        window.location = "/pagenotfound.html";
        return;
    }

    let profile = liff.getDecodedIDToken();
    user["uidLine"] = profile.sub;
    user["idToken"] = liff.getIDToken();
};

async function initMap() {
    let myLocation;
    let coords;
    try {
        myLocation = await getLocation();
        coords = new google.maps.LatLng(
            myLocation.latitude,
            myLocation.longitude
        );
    } catch (error) {
        return alert(error.error);
    }

    mapRender(google, coords);
}

const mapRender = (google, latlng) => {
    map = new google.maps.Map(document.getElementById("map"), {
        center: latlng,
        zoom: 20,
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
