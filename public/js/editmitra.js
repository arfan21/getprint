function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

var id = getUrlParameter('id');
var linkfoto = getUrlParameter('linkfoto');
var deleteHash = getUrlParameter('deletehash');

var appang = angular.module('menjadimitra',[]);

appang.controller("menjadimitraCtrl",['$scope','$http','$window', function($scope,$http,$window){
    $scope.data = {}
    
    $http({
        method : "GET",
        url: "/api/mitra/" + id,
    }).then(function successCallback(response){
        $scope.data = response.data.mitra[0]
        $scope.data.link_foto = linkfoto;
    });

    

    $scope.submitform = function(){

        $scope.data.link_foto = linkfoto;
        $scope.data.deleteHash_foto = deleteHash

        $http({
            method : "PUT",
            url: "/api/mitra/" + id,
            data : $scope.data,
        }).then(function successCallback(response){
            $window.alert(response.data.message);
            $window.location.href = '/detail.html?id='+id+'&useridline=U806e7bec3288e9572243e079aa7b6b16';
        });
    }
    
}]);