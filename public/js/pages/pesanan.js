var id = getUrlParameter("id");

$("#arrowBack").attr("href", "/detail.html?id=" + id);
$("#cancelBtn").attr("href", "/detail.html?id=" + id);

if (id.length == 0) {
    window.location = "/pagenotfound.html";
}

var app = angular.module("pesanan", []);

app.directive("customFileInput", [
    function () {
        let filenameArr = [];
        return {
            link: function (scope, element, attrs) {
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
        $("#submitData").prop("disabled", true);
    }
});

app.controller("myapp", [
    "$scope",
    "$http",
    "$window",
    async ($scope, $http, $window) => {
        $scope.data = {};
        $scope.data.lokasi = {};
        $scope.data.delivery = true;
        const callLiffInit = await liffInit(liff).then(
            async (result) => {
                await liffApp();
            },
            (err) => {
                alert(err);
            }
        );
        //userid_line untuk auth
        $scope.data.userid_line = user.uidLine;

        await $http({
            method: "GET",
            url: "/api/mitra/" + id,
        })
            .then(function successCallback(response) {
                $scope.mitra = response.data.data[0];
            })
            .catch((err) => {
                $window.location = "/pagenotfound.html";
            });

        $scope.forms = [{ name: "file1", filename: "filename1" }];
        $scope.addform = function () {
            if ($scope.forms.length <= 4) {
                $scope.forms.push({
                    name: "file" + ($scope.forms.length + 1),
                    filename: "filename" + ($scope.forms.length + 1),
                });
            }
        };

        const file = [];
        $scope.listFile = (e, files) => {
            var id = e.id.charAt(e.id.length - 1);
            file[id - 1] = files[0];
        };

        $scope.uploadFiles = () => {
            var fd = new FormData();
            for (i = 0; i < file.length; i++) {
                fd.append("myfile", file[i]);
            }
            //userid_line untuk auth
            fd.append("userid_line", user.uidLine);

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
                url: "/api/uploadfile",
                uploadEventHandlers: {
                    progress: (e) => {
                        const percent = e.lengthComputable
                            ? (e.loaded / e.total) * 100
                            : 0;

                        if (percent < 100) {
                            progress_bar.style.width = percent.toFixed(2) + "%";
                            progress_bar.textContent = percent.toFixed(2) + "%";
                        }
                    },
                },
                data: fd,
                transformRequest: angular.identity,
                headers: {
                    "Content-Type": undefined,
                    Authorization: `Bearer ${user.idToken}`,
                },
            })
                .then((data) => {
                    $("#submitData").prop("disabled", false);
                    $("#progress-layout").html(`
                        <p style="color:#00FF00;text-align: center;">FILE terupload!</p>
                    `);
                    let dataFile = data.data;

                    $scope.data.id_toko = id;
                    $scope.data.userid_line = user.uidLine;
                    $scope.data.id_file = dataFile.data._id;

                    $scope.submitMyform = function () {
                        let jenispesanan;
                        let pesanan = document.getElementsByClassName(
                            "jenispesanan"
                        );

                        for (i = 0; i < pesanan.length; i++) {
                            if (pesanan[i].selected) {
                                jenispesanan = pesanan[i].value;
                            }
                        }

                        $scope.data.jenispesanan = jenispesanan;

                        $http({
                            method: "POST",
                            url: "/api/pesanan",
                            headers: {
                                Authorization: `Bearer ${user.idToken}`,
                            },
                            data: $scope.data,
                        })
                            .then((data) => {
                                let dataPesanan = data.data;
                                $window.alert(dataPesanan.message);

                                sendToWa(
                                    dataPesanan.data,
                                    $scope.mitra,
                                    dataFile.data
                                );
                                $window.location = "/";
                            })
                            .catch((err) => {
                                console.log(err);
                                if (err.data.message == "IdToken expired.") {
                                    alert("Sesi anda telah habis");
                                    liff.loguout();
                                    window.location = "/";
                                    return;
                                }
                            });
                    };
                })
                .catch((err) => {
                    if (err.data.message == "IdToken expired.") {
                        alert("Sesi anda telah habis");
                        liff.loguout();
                        window.location = "/";
                        return;
                    }
                    $("#progress-layout").html(``);
                    $("#uploadBtn").prop("disabled", false);
                    $("#addForm").prop("disabled", false);
                    alert("Try again to upload file");
                });
        };
        $("body").css("display", "block");
    },
]);

const sendToWa = (data, dataToko, dataFile) => {
    let nohp_fromdata = dataToko.no_hp;
    let nohpID = nohp_fromdata.replace("0", "62");

    let link = dataFile.link_file;
    let linkString = link.join("%0A-");
    let delivery = data.delivery;
    if (delivery) {
        delivery = "Pesanan diantar";
    } else {
        delivery = "Pesanan diambil sendiri";
    }
    liff.openWindow({
        url: `https://api.whatsapp.com/send?phone=${nohpID}&text=*GETPRINT*%0A%0A*Delivery%20%3F*%0A${delivery}%0A%0A*INFO%20PEMESAN*%0ANama%20Pemesan%20%09%3A%20${data.nama_pemesan}%2C%0ANo%20HP%20%09%09%3A%20${data.nohp_pemesan}%2C%0AAlamat%20Pemesanan%3A%20${data.lokasi.alamat_pemesan}%2C%0A%0A*Jenis%20Pesanan*%0A${data.jenis_pesanan}%2C%0A%0A*Lokasi%20Pemesan*%0Ahttps%3A%2F%2Fwww.google.com%2Fmaps%2Fsearch%2F%3Fapi%3D1%26query%3D${data.lokasi.lat}%2C${data.lokasi.lng}%0A%0A*Link%20File*%0A-${linkString}`,
        external: true,
    });
};

const user = {};

const liffApp = () => {
    if (!liff.isLoggedIn()) {
        liff.login();
        return;
    }

    let profile = liff.getDecodedIDToken();
    user["uidLine"] = profile.sub;
    user["idToken"] = liff.getIDToken();
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
            $("#fixAddress").val(result[0].formatted_address).trigger("input");
            $("#address").val(result[0].formatted_address);
        }
    });
};

$("#saveLocation").on("click", () => {
    $("#fixAddress").val($("#address").val()).trigger("input");
});
