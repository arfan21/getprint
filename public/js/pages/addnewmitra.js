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

        try {
            const res = await $http({
                method: "GET",
                url: `/api/mitrainactive`,
                headers: {
                    Authorization: `Bearer ${user.idToken}`,
                },
            });

            $scope.$apply(() => {
                $scope.data = res.data.data;
            });
        } catch (error) {
            if (error.data.error == "Mitra not found") {
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
        }

        $scope.acceptBtn = acceptBtn;
        $scope.declineBtn = declineBtn;
        removeLoaderList(0);
    },
]);

const acceptBtn = async (data, array, index) => {
    let dataMitra = data;
    dataMitra["status"] = "active";

    try {
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
        const res = await $http({
            method: "PUT",
            url: `/api/mitra/${dataMitra._id}`,
            headers: {
                Authorization: `Bearer ${user.idToken}`,
            },
            data: dataMitra,
        });
    } catch (error) {}
};

const declineBtn = async (data, array, index) => {
    let dataMitra = data;

    try {
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
        const res = await $http.delete(`/api/mitra/${dataMitra._id}`, {
            headers: {
                "Content-Type": "application/json;charset=utf-8",
                Authorization: `Bearer ${user.idToken}`,
            },
        });
    } catch (error) {}
};

async function liffApp() {
    App();
}

const user = {};
const uidLine = [];
const idToken = [];

const App = async () => {
    if (liff.isLoggedIn()) {
        let profile = liff.getDecodedIDToken();
        user["user_id"] = profile.sub;
        user["idToken"] = liff.getIDToken();

        try {
            const admin = await isAdmin(user.idToken);

            if (!admin.admin) {
                window.location = "/pagenotfound.html";
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
    } else {
        window.location = "/pagenotfound.html";
    }
};

function removeLoaderList(i) {
    if ($(".loadingList").length == 1) {
        i = 0;
    }

    $($(".loadingList")[i]).fadeOut(500, function () {
        // fadeOut complete. Remove the loading div
        $($(".loadingList")[i]).remove(); //makes page more lightweight
    });
}
