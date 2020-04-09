var appang = angular.module('menjadimitra',[]);

appang.controller("menjadimitraCtrl",['$scope','$http','$window', function($scope,$http,$window){
    console.log($scope.data)
    $scope.data = {}
            
    $scope.submitform = function(){
        console.log($scope.data)
        $http({
            method : "POST",
            url : "/api/mitra",
            data : $scope.data,
        }).then(function successCallback(response){
            console.log(response);
            window.location.href = "/";
        })
    }
}]);