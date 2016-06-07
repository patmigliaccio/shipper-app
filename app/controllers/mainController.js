(function () {
	'use strict';

	var app = angular.module('ShipperApp');

	app.controller('MainCtrl', ['$scope', '$location', function ($scope, $location) {
		var mc = this;

		//TODO move nav links to view and off controller
		mc.pages = [
			{ name: 'Orders', url: '#!/orders', path: '/orders' },
			{ name: 'Totals', url: '#!/totals', path: '/totals' }
		];
		
		//sets active nav tab
		mc.isActive = function(pagePath){
			return pagePath === $location.path();
		};
	}]);


	
})();