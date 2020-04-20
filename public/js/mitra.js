var appang = angular.module('menjadimitra',[]);

appang.controller("menjadimitraCtrl",['$scope','$http','$window', function($scope,$http,$window){
    $scope.data = {}
            
    $scope.submitform = function(){
        $http({
            method : "POST",
            url : "/api/mitra",
            data : $scope.data,
        }).then(function successCallback(response){
            console.log(response);
            $window.alert(response.data.message);
            $window.location.href = '/';
        })
    }
}]);