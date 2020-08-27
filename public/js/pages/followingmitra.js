var app = angular.module("myApp", []);

const $http = angular.injector(["ng"]).get("$http");

app.controller("appCtrl", [
    "$scope",
    "$http",
    "$window",
    async function ($scope, $http, $window) {
        let coords;
        let myLocation;
        try {
            myLocation = await getLocation();
            coords = new google.maps.LatLng(
                myLocation.latitude,
                myLocation.longitude
            );
        } catch (error) {
            alert(error.message);
            coords = new google.maps.LatLng(-0.789275, 113.921327);
        }

        try {
            await liffInit(liff);
            await liffApp();
        } catch (error) {
            alert(error.error);
        }

        try {
            const res = await $http({
                method: "GET",
                url: `/api/followmitra?match=user_id`,
                headers: {
                    Authorization: `Bearer ${user.idToken}`,
                },
            });

            const mitra = await getMitra(res.data.data);

            $scope.$apply(() => {
                $scope.followed = res.data.data;
                $scope.data = mitra;
            });
            setTimeout(() => printDistance($scope.data, coords, google), 1);
            for (i = 0; i < $scope.data.length; i++) {
                let classFollowing = $scope.data[i]._id;

                $("." + classFollowing).removeClass("fa-heart-o");
                $("." + classFollowing).addClass("fa-heart");
                $("." + classFollowing).addClass($scope.followed[i]._id);
                $("." + $scope.followed[i]._id).removeClass(classFollowing);
            }
            removeLoaderList(0);
        } catch (error) {
            $("body").css("display", "block");
            $("#container-following").html(`
                <div id="not-found" class="text-center container">
                    <img src="./assets/banner-404.png" alt="...">
                    <br>
                    <p>Maaf, kami tidak bisa menemukan mitra yang anda ikuti.</p>
                    <a href="/" class="btn btn-primary">BACK</a>
                </div>
            `);
        }

        $scope.unfollow = unfollow;
    },
]);

const printDistance = (data, myLatLng, google) => {
    for (i = 0; i < data.length; i++) {
        let mitraLatLng = new google.maps.LatLng(
            data[i].coords.lat,
            data[i].coords.lng
        );
        let distance = getDistance(google, myLatLng, mitraLatLng);

        if (distance != -1) {
            $(`.${data[i].fotomitra[0]._id}`).text(`${distance} km`);
        }
    }
};

const getMitra = async (data) => {
    return await data.map((d) => d.mitra);
};

async function unfollow(array, index) {
    let classNameEvent = event.srcElement.className;
    let classNameObj = classNameEvent.split(" ");
    let id = classNameObj[classNameObj.length - 1];

    if ($("." + id).hasClass("fa-heart")) {
        $("." + id).removeClass("fa-heart");
        $("." + id).addClass("fa-heart-o");

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

        try {
            const res = await $http({
                method: "DELETE",
                url: `/api/followmitra/${id}`,
                data: {
                    userid_line: user.user_id,
                },
                headers: {
                    Authorization: `Bearer ${user.idToken}`,
                },
            });

            let idbaru = res.data.data.id_toko;
            $("." + id).addClass(idbaru);
            $("." + idbaru).removeClass(id);
        } catch (error) {}
    }
}

async function liffApp() {
    App();
}

const user = {};

const App = async () => {
    if (liff.isLoggedIn()) {
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
    } else {
        liff.login();
    }
};

const getDistance = (google, from, to) => {
    const myLatLng = [];
    myLatLng[0] = new google.maps.LatLng(-0.789275, 113.921327);
    if (from.lat() == myLatLng[0].lat() && from.lng() == myLatLng[0].lng()) {
        return -1;
    }
    return (
        google.maps.geometry.spherical.computeDistanceBetween(
            from,

            to
        ) / 1000
    ).toFixed(2);
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
