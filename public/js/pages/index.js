var app = angular.module("myApp", []);
app.controller("appCtrl", [
    "$scope",
    "$http",
    "$window",
    function ($scope, $http, $window) {
        $scope.data = {};

        $http({
            method: "GET",
            url: "/api/mitra",
        }).then(function successCallback(response) {
            $scope.data = response.data.mitra;
        });
        $http({
            method: "GET",
            url: "/api/mitra?sort=date",
        }).then(function successCallback(response) {
            $scope.databydate = response.data.mitra;
        });
        $http({
            method: "GET",
            url: "/api/mitra?sort=rating",
        }).then(function successCallback(response) {
            $scope.databyrating = response.data.mitra;
        });
    },
]);

function follow(obj) {
    let classObj = $(obj).attr("class");
    let className = classObj.split(" ");
    let id = className[className.length - 1];

    let useridline = $("#heart-body").data("useridline");
    if (useridline == undefined) {
        return;
    }

    if ($("." + id).hasClass("fa-heart")) {
        $("." + id).removeClass("fa-heart");
        $("." + id).addClass("fa-heart-o");
        $.ajax({
            method: "DELETE",
            url: "/api/followingmitra/" + id,
            success: function (response) {
                let idbaru = response.followingdata.id_toko;
                $("." + id).addClass(idbaru);
                $("." + idbaru).removeClass(id);
            },
        });
    } else {
        let data = {
            id_toko: id,
            userid_line: useridline,
        };
        $.ajax({
            method: "POST",
            url: "/api/followingmitra/",
            data: data,
            success: function (response) {
                let idBaru = response.followingdata._id;
                $("." + id).addClass(idBaru);
                $("." + idBaru).removeClass(id);
            },
        });

        $("." + id).removeClass("fa-heart-o");
        $("." + id).addClass("fa-heart");
    }
}

const callLiffInit = liffInit(liff).then(
    (result) => {
        liffApp();
    },
    (err) => {
        alert(err.error);
    }
);

function liffApp() {
    App();

    checkIsInClient();
}

function checkIsInClient() {
    if (!liff.isInClient()) {
        alert("You are opening the app in an external browser.");
        if (!liff.isLoggedIn()) {
            $("#welcome-message").append(`
                <div style="width: 90%;text-align: right;">
                    <button id="loginLine" class="btn btn-primary">Login</button>
                </div>
                
            `);
            $("#loginLine").on("click", () => {
                liff.login();
            });
        } else {
            $("#welcome-message").append(`
                <div style="width: 30%;text-align: right;">
                    <button id="loginLine" class="btn btn-primary">Log Out</button>
                </div>
                
            `);
            $("#loginLine").on("click", () => {
                liff.logout();
                window.location.reload();
            });
        }
    }
}

const App = async () => {
    if (liff.isLoggedIn()) {
        let profile = liff.getDecodedIDToken();

        const profileName = profile.name;
        const linkProfilePicture = profile.picture;
        const userIDLine = profile.sub;

        $("#welcome-message #profileName").html(
            `
            <img src="` +
                linkProfilePicture +
                `" alt="Profile-Picture" style="width: 40px;height: 40px;border-radius: 50%;">
            <h2 style="margin: 0px 0px 0px 10px;">` +
                profileName +
                `</h2>
        `
        );

        await $("#welcome-message #profileName").css(
            "display",
            "-webkit-inline-box"
        );

        $("#heart-body").attr("data-useridline", userIDLine);
        await $.ajax({
            method: "GET",
            url: "/api/followingmitra/" + userIDLine,
            success: function (response) {
                let followed = response.followingdata;

                if (response.status) {
                    for (i = 0; i < followed.length; i++) {
                        let classFollowing = followed[i].id_toko;
                        $("." + classFollowing).removeClass("fa-heart-o");
                        $("." + classFollowing).addClass("fa-heart");
                        $("." + classFollowing).addClass(followed[i]._id);
                        $("." + followed[i]._id).removeClass(classFollowing);
                    }
                }
            },
        });

        await adminMenu(userIDLine);
    } else {
        $(".fa-heart-o").click(() => {
            liff.login();
        });
    }
    removeLoader();
};

async function adminMenu(userIDLine) {
    const admin = await isAdmin(userIDLine).then(
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
    if (admin.admin) {
        $("#adminMenu").html(
            `
                <div id="addnewmitra" style="text-align: right;">
                    <a  
                        id="loginLine" 
                        style="color:black;cursor:pointer"
                        href="mitra.html">Add New Mitra</a>
                </div>
                
            `
        );
    }
}

function removeLoader() {
    $("#loadingDiv").fadeOut(500, function () {
        // fadeOut complete. Remove the loading div
        $("#loadingDiv").remove(); //makes page more lightweight
    });
}
