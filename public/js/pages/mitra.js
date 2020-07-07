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
    async ($scope, $http, $window) => {
        const callLiffInit = await liffInit(liff).then(
            (result) => {
                liffApp();
            },
            (err) => {
                alert(err);
            }
        );

        $scope.data = {};

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
    },
]);

const uidLine = [];

const liffApp = async () => {
    if (!liff.isLoggedIn()) {
        window.location = "/pagenotfound.html";
        return;
    }

    let profile = liff.getDecodedIDToken();

    uidLine[0] = profile.sub;

    const admin = await isAdmin(uidLine[0]).then(
        (result) => {
            return result;
        },
        (err) => {
            return err;
        }
    );

    if (!admin.success) {
        alert(admin.err);
        return;
    }

    if (!admin.admin) {
        window.location = "/pagenotfound.html";
    }

    $("body").css("display", "block");
};
