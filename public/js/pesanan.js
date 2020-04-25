function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};
var id = getUrlParameter('id');
var uidline = getUrlParameter('useridline');

var apppesan = angular.module('pesanan',[]);
apppesan.controller("myappCtrl",['$scope','$http','$window', function($scope,$http,$window){
	$scope.data = {};
	$scope.data.id_toko = id;
	$scope.data.userid_line = uidline;	
	     
    $scope.submitMyform = function(){
		let jenispesanan = [];
		let pesanan = document.getElementsByClassName('jenispesanan');
		
		for(i = 0; i < pesanan.length; i++){
			
			if(pesanan[i].checked){
				
				jenispesanan.push(pesanan[i].value)
			}	
		}

		$scope.data.jenispesanan = jenispesanan;

        $http({	
            method : "POST",
            url : "/api/pesanan",
            data : $scope.data,
        }).then(function successCallback(response){
			let data = response.data.pesanan;

            $window.alert(response.data.message);
			$window.location.href = "/upload.html?id=" + data._id;
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