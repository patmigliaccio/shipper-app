angular.module('ShipperApp', ['ngRoute'])
    .config(function ($routeProvider) {
        $routeProvider

            .when('/', {
                templateUrl: 'app/views/ordersView.html',
                controller: 'OrdersCtrl'
            })

            .when('/totals', {
                templateUrl: 'app/views/totalsView.html',
                controller: 'TotalsCtrl'
            });
    });

angular.module('Authentication', []);