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

app.controller("menjadimitraCtrl", [
    "$scope",
    "$http",
    "$window",
    function ($scope, $http, $window) {
        $scope.data = {};
        $scope.data.coords = {};
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
                url: "/api/uploadfotomitra",
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
                headers: { "Content-Type": undefined },
            }).then(
                (result) => {
                    $("#progress-layout").html(`
                        <p style="color:#00FF00;text-align: center;">FILE terupload!</p>
                    `);
                    result = result.data;

                    $scope.data.id_foto = result.data._id;
                    $scope.submitform = function () {
                        $http({
                            method: "POST",
                            url: "/api/mitra",
                            data: $scope.data,
                        }).then(function successCallback(response) {
                            $window.alert(response.data.message);
                            $window.location.href = "/";
                        });
                    };
                },
                (err) => {
                    $("#progress-layout").html(``);
                    $("#uploadBtn").prop("disabled", false);
                    $("#addForm").prop("disabled", false);
                    alert("Try again to upload file");
                }
            );
        };
        $scope.submitform = function () {
            console.log($scope.data);
            // $http({
            //     method: "POST",
            //     url: "/api/mitra",
            //     data: $scope.data,
            // }).then(function successCallback(response) {
            //     $window.alert(response.data.message);
            //     $window.location.href = "/";
            // });
        };
    },
]);

async function initMap() {
    const defaulLatlng = new google.maps.LatLng(-0.789275, 113.921327);

    const myLocation = await getLocation().then(
        (result) => {
            alert(result);
            return {
                status: true,
                coords: result,
            };
        },
        (err) => {
            alert(err);
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

        const firsLatLng = [
            new google.maps.LatLng(
                myLocation.coords.latitude,
                myLocation.coords.longitude
            ),
        ];
        mapRender(google, latlng[0], firsLatLng[0]);
    }
}

const mapRender = (google, latlng, firstLatLng) => {
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

    getLocationCenter(google, geocoder, map, latlng, firstLatLng);

    $("<div/>").addClass("marker-centered").appendTo(map.getDiv());
    $("#default_latitude").val(latlng.lat()).trigger("input");
    $("#default_longitude").val(latlng.lng()).trigger("input");

    getAddress(geocoder, latlng);
    var distance = getDistance(google, firstLatLng, latlng);

    $("#distance").val(distance);
};

const getLocationCenter = (google, geocoder, map, latlng, firstLatLng) => {
    google.maps.event.addListener(map, "center_changed", function () {
        latlng = new google.maps.LatLng(
            map.getCenter().lat(),
            map.getCenter().lng()
        );

        $("#default_latitude").val(latlng.lat).trigger("input");
        $("#default_longitude").val(latlng.lng).trigger("input");

        getAddress(geocoder, latlng);

        var distance = getDistance(google, firstLatLng, latlng);

        $("#distance").val(distance);
    });
};

const getAddress = (geocoder, latlng) => {
    geocoder.geocode({ location: latlng }, (result, status) => {
        if (status == "OK") {
            $("#address").val(result[0].formatted_address);
        }
    });
};

const getDistance = (google, from, to) => {
    return (
        google.maps.geometry.spherical.computeDistanceBetween(
            from,

            to
        ) / 1000
    ).toFixed(2);
};

$("#submitBtn").on("click", () => {
    const latlng = {
        lat: $("#default_latitude").val(),
        lng: $("#default_longitude").val(),
    };

    const distance = $("#distance").val();
    const address = $("#address").val();
    console.log({
        latlng: latlng,
        distance: distance,
        address: address,
    });
});

$("#saveLocation").on("click", () => {
    $("#fixAddress").val($("#address").val()).trigger("input");
});

navigator.permissions
    .query({ name: "geolocation" })
    .then(function (permissionStatus) {
        console.log("geolocation permission state is ", permissionStatus.state);

        permissionStatus.onchange = function () {
            console.log(
                "geolocation permission state has changed to ",
                this.state
            );
        };
    });

$("#mapBtn").on("click", async () => {
    const myLoc = await getLocation();
});
