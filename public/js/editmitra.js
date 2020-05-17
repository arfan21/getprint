function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

var id = getUrlParameter('id');

var appang = angular.module('menjadimitra',[]);

appang.controller("menjadimitraCtrl",['$scope','$http','$window', function($scope,$http,$window){
    $scope.data = {}
    $http({
        method : "GET",
        url: "/api/mitra/" + id,
    }).then(function successCallback(response){
        $scope.data = response.data.mitra[0]
        console.log(response.data.mitra[0]);
    });
    $scope.submitform = function(){
        $http({
            method : "PUT",
            url: "/api/mitra/" + id,
            data : $scope.data,
        }).then(function successCallback(response){
            console.log(response.data);
            $window.alert(response.data.message);
            $window.location.href = '/detail.html?id='+id+'&useridline=U806e7bec3288e9572243e079aa7b6b16';
        });
    }
    
}]);