var appang = angular.module('menjadimitra',[]);

appang.controller("menjadimitraCtrl",['$scope','$http','$window', function($scope,$http,$window){
    console.log($scope.data)
    $scope.data = {}
            
    $scope.submitform = function(){
        console.log($scope.data)
        $http({
            method : "POST",
            url : "/mitra",
            data : $scope.data,
        }).then(function successCallback(response){
            console.log(response);
            window.location.href = "https://api.whatsapp.com/send?phone=6289635639022&text=%2aGetPrint%2a%20%0ANama%20Toko%20%3A%20"+$scope.data.namatoko+"%2C%0ANama%20Pemilik%20%3A%20"+$scope.data.namapemilik+"%2C%0AAlamat%20Toko%20%3A%20"+$scope.data.alamattoko+"%2C%0ASaya%20tertarik%20untuk%20bergabung%20dengan%20mitra%20anda.";
        })
    }
}]);