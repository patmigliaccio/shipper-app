(function (){
	'use strict';

	var app = angular.module('ShipperApp');

	app.controller('MainCtrl', ['$scope', 'ShipStation', function($scope, ShipStation){
		var mc = this;
		
		ShipStation.getOrders()
			.then(function(data){
				mc.orders = data;
			});

	}]);

})();