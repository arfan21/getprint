function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};
var id = getUrlParameter('id');
var uidline = getUrlParameter('useridline');
var linkfile = getUrlParameter('linkfile')

var apppesan = angular.module('pesanan',[]);
apppesan.controller("myappCtrl",['$scope','$http','$window', function($scope,$http,$window){
	$scope.data = {};
	$scope.data.id_toko = id;
	$scope.data.userid_line = uidline;	
	$scope.data.link_file = linkfile;	
	     
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
			
			$http({
				method : "GET",
				url : "/api/pesanan/byid/"+ data._id,
			}).then(function successCallback(response){
				let data = response.data.pesanan;
				console.log(data);
				$window.location.href = "https://api.whatsapp.com/send?phone="+data[0].toko[0].no_hp+"&text=**GETPRINT**%0ANama%20Pemesan%20%09%3A%20"+data[0].nama_pemesan+"%2C%0ANo%20HP%20%09%09%3A%20"+data[0].nohp_pemesan+"%2C%0AAlamat%20Pemesanan%3A%20"+data[0].alamat_pemesan+"%2C%0A**Jenis%20Pesanan**%0A"+"-"+data[0].jenis_pesanan.join("%0A-")+"%2C%0A**Link%20File**%0A"+data[0].link_file;
			})

			
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