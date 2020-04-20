// function getUrlParameter(name) {
//     name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
//     var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
//     var results = regex.exec(location.search);
//     return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
// };
// var id = getUrlParameter('id');

var apppesan = angular.module('pesanan',[]);
apppesan.controller("myappCtrl",['$scope','$http','$window', function($scope,$http,$window){
    $scope.data = {}
            
    $scope.submitMyform = function(){
        $http({
            method : "POST",
            url : "/api/pesanan",
            data : $scope.data,
        }).then(function successCallback(response){
            console.log(response);
            $window.alert(response.data.message);
			$window.open("https://api.whatsapp.com/send?phone=6289635639022&text=**GETPRINT**%0ANama%20Pemesan%20%09%3A%20"+$scope.data.nama+"%2C%0ANo%20HP%20%09%09%3A%20"+$scope.data.nohp_pemesan+"%2C%0AAlamat%20Pemesanan%3A%20alamat%2C%0A**Jenis%20Pesanan**%0A"+"-"+$scope.data.print+"%0A"+"-"+$scope.data.fotocopy+"%0A"+"-"+$scope.data.scan,  '_blank');
			$window.location.href = "/";
        })
    }
}]);

Array.prototype.forEach.call(document.querySelectorAll('[type=radio]'), function(radio) {
	radio.addEventListener('click', function(){
		var self = this;
		// get all elements with same name but itself and mark them unchecked
		Array.prototype.filter.call(document.getElementsByName(this.name), function(filterEl) {
			return self !== filterEl;
		}).forEach(function(otherEl) {
			delete otherEl.dataset.check
		})

		// set state based on previous one
		if (this.dataset.hasOwnProperty('check')) {
			this.checked = false
			delete this.dataset.check
		} else {
			this.dataset.check = ''
		}
	}, false)
})