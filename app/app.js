angular.module('ShipperApp', ['ngRoute', 'ngSanitize', 'ngCsv'])
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/orders', {
                templateUrl: 'app/views/ordersView.html',
                controller: 'OrdersCtrl',
                controllerAs: 'oc'
            })
            .when('/totals', {
                templateUrl: 'app/views/totalsView.html',
                controller: 'TotalsCtrl',
                controllerAs: 'tc'
            })
            .otherwise('/orders');

        //TODO get html5mode working
        $locationProvider.html5Mode(false).hashPrefix('!');
        
    }]);

angular.module('Authentication', []);