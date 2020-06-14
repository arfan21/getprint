function getUrlParameter(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    var results = regex.exec(location.search);
    return results === null
        ? ""
        : decodeURIComponent(results[1].replace(/\+/g, " "));
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
    function ($scope, $http, $window) {
        $scope.data = {};

        $(uploadForm).bind("submit", uploadFile);

        function uploadFile(e) {
            $("#progress-layout").html(`   
                <div class="progress" style="margin-top: 20px; margin-bottom:20px" id="progress">
                    <div class="progress-bar" role="progressbar" " aria-valuemin="0" aria-valuemax="100">0%</div>
                </div>
            `);
            $("#uploadBtn").prop("disabled", true);
            const progress_bar = document.getElementsByClassName(
                "progress-bar"
            )[0];

            e.preventDefault();

            var data = new FormData(uploadForm);

            const xhr = new XMLHttpRequest();

            xhr.open("POST", "/api/uploadfotomitra");
            xhr.upload.addEventListener("progress", (e) => {
                const percent = e.lengthComputable
                    ? (e.loaded / e.total) * 100
                    : 0;

                progress_bar.style.width = percent.toFixed(2) + "%";
                progress_bar.textContent = percent.toFixed(2) + "%";
            });
            xhr.setRequestHeader("enctype", "multipart/form-data");
            xhr.send(data);

            xhr.onreadystatechange = function () {
                if (xhr.readyState == XMLHttpRequest.DONE) {
                    let response = JSON.parse(xhr.responseText);

                    if (!response.status) {
                        $("#uploadBtn").prop("disabled", false);
                        $("#addForm").prop("disabled", false);
                        alert(response.message + ". Try again");
                    } else {
                        $("#progress-layout").html(`
                            <p style="color:red;text-align: center;">FILE terupload!</p>
                        `);
                        $scope.data.id_foto = response.data._id;
                        $scope.submitform = function () {
                            $http({
                                method: "POST",
                                url: "/api/mitra",
                                data: $scope.data,
                            }).then(function successCallback(response) {
                                console.log(response);
                                $window.alert(response.data.message);
                                $window.location.href = "/";
                            });
                        };
                    }
                }
            };
        }
    },
]);
