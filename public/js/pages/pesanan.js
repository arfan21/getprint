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

app.controller("myapp", [
    "$scope",
    "$http",
    "$window",
    async ($scope, $http, $window) => {
        $scope.data = {};

        $scope.data.delivery = true;
        const callLiffInit = await liffInit(liff).then(
            async (result) => {
                await liffApp();
            },
            (err) => {
                alert(err);
            }
        );

        $http({
            method: "GET",
            url: "/api/mitra/" + id,
        }).then(
            function successCallback(response) {
                $("body").css("display", "block");
                $scope.mitra = response.data.mitra[0];
            },
            (err) => {
                $window.location = "/pagenotfound.html";
            }
        );

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
                headers: { "Content-Type": undefined },
            }).then(
                (result) => {
                    $("#progress-layout").html(`
                        <p style="color:#00FF00;text-align: center;">FILE terupload!</p>
                    `);
                    result = result.data;

                    $scope.data.id_toko = id;
                    $scope.data.userid_line = uidLine[0];
                    $scope.data.id_file = result.data._id;

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
                            data: $scope.data,
                        }).then(function successCallback(response) {
                            let data = response.data.pesanan;
                            $window.alert(response.data.message);
                            console.log(data);

                            $http({
                                method: "GET",
                                url: "/api/pesanan/byid/" + data._id,
                            }).then(function successCallback(response) {
                                let data = response.data.pesanan;

                                sendToWa(data);

                                $window.location = "/";
                            });
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
    },
]);

const sendToWa = (data) => {
    let nohp_fromdata = data[0].toko[0].no_hp;
    let nohpID = nohp_fromdata.replace("0", "62");

    let link = data[0].file[0].link_file;
    let linkString = link.join("%0A-");
    let delivery = data[0].delivery;
    if (delivery) {
        delivery = "Pesanan diantar";
    } else {
        delivery = "Pesanan diambil sendiri";
    }

    window.open(
        "https://api.whatsapp.com/send?phone=" +
            nohpID +
            "&text=*GETPRINT*%0A%0A*Delivery%20%3F*%0A" +
            delivery +
            "%0A%0A*INFO%20PEMESAN*%0ANama%20Pemesan%20%09%3A%20" +
            data[0].nama_pemesan +
            "%2C%0ANo%20HP%20%09%09%3A%20" +
            data[0].nohp_pemesan +
            "%2C%0AAlamat%20Pemesanan%3A%20" +
            data[0].alamat_pemesan +
            "%2C%0A%0A*Jenis%20Pesanan*%0A" +
            data[0].jenis_pesanan +
            "%2C%0A%0A*Link%20File*%0A-" +
            linkString,
        "_blank"
    );
};

const uidLine = [];

const liffApp = () => {
    if (!liff.isLoggedIn()) {
        liff.login();
        return;
    }
    let profile = liff.getDecodedIDToken();
    uidLine[0] = profile.sub;
};
