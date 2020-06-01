function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};
var id = getUrlParameter('id');
var uidline = getUrlParameter('useridline');

var link = document.getElementById('link').href;
document.getElementById('link').href = link + "&useridline="+uidline;

var app = angular.module('detailmitra', []);
app.controller("appCtrl", ['$scope','$http','$window', function($scope,$http,$window){
    $http({
        method : "GET",
        url: "/api/mitra/" + id,
    }).then(function successCallback(response){
        $scope.data = response.data.mitra[0]

        if(uidline == "U806e7bec3288e9572243e079aa7b6b16"){
            $('.getprint-round-navbar').append(`
                <div class="detail-admin-menu">
                    <a class="fa fa-pencil" href="/editmitra.html?id=`+$scope.data._id+`&useridline=U806e7bec3288e9572243e079aa7b6b16&linkfoto=`+$scope.data.link_foto+`"></a>
                    <a class="fa fa-trash" data-toggle="modal" data-target="#exampleModalCenter" ></a>
                </div>
                
            `)
        }
    });

    $scope.deleteFunc = () => {
        $http({
            method : "DELETE",
            url : "https://api.imgur.com/3/image/"+ $scope.data.deleteHash_foto,
            headers : {"Authorization" : "Client-ID f4a9a61acd375d4"},
        }).then(function successCallback(response){
            console.log(response)
        });

        $http({
            method : "DELETE",
            url: "/api/mitra/" + id,
        }).then(function successCallback(response){
            $('#exampleModalLongTitle').text("Mitra berhasil terhapus !");
            $('#deleteBtn').css("display", "none");
            $('#batalBtn').removeClass('btn-secondary');
            $('#batalBtn').addClass('btn-primary');
            $('#batalBtn').text('Ok');
            $('#batalBtn').removeAttr('data-dismiss');
            $('#batalBtn').attr("href", "/");
            $('.close').css("display", "none");
        });
    }
}]);

