(function () {
	'use strict';

	var app = angular.module('ShipperApp');

	app.controller('MainCtrl', ['$scope', '$state', '$rootScope', function ($scope, $state, $rootScope) {
		var mc = this;

		$rootScope.$on('unauthorized', function() {
			$state.go('home'); //TODO prompt user for login if unauthorized
		});
	}]);


	
})();