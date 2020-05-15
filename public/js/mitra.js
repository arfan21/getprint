function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

var linkfoto = getUrlParameter('linkfoto');

var appang = angular.module('menjadimitra',[]);

appang.controller("menjadimitraCtrl",['$scope','$http','$window', function($scope,$http,$window){
    $scope.data = {}
    $scope.data.linkfoto = linkfoto;

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

window.addEventListener('beforeunload', function (e) { 
    e.preventDefault(); 
    e.returnValue = ''; 
}); 

