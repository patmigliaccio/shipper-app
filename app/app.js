angular.module('ShipperApp', ['ngRoute', 'ngSanitize', 'ngCsv'])
    .config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {
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

        //uses proxy for http requests
        $httpProvider.interceptors.push(function ($q) {
            return {
                'request': function (config) {
                    if (!~config.url.indexOf('/views/')){  //ignores ngRoute requests
                        config.url = 'proxy.php?url=' + config.url + '&mode=native';
                    }

                    return config || $q.when(config);
                }

            }
        });
    }]);

angular.module('Authentication', []);