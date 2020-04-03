var app = angular.module('myApp',[]);
app.controller("appCtrl", ['$scope','$http','$window', function($scope,$http,$window){
    $http({
        method: "GET",
        url: "/api/mitra",
    }).then(function successCallback(response){
        $scope.data = response.data.mitra
        console.log(response.data.message);
    });
}]);