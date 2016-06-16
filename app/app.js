angular.module('ShipperApp', ['Authentication', 'ngRoute', 'ngSanitize', 'ngCsv'])
    .config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {
        $routeProvider
            .when('/login', {
                templateUrl: 'app/views/loginView.html',
                controller: 'LoginCtrl'
            })
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
            .otherwise('/login');

        //TODO get html5mode working
        $locationProvider.html5Mode(false).hashPrefix('!');

        //uses proxy for http requests
        $httpProvider.interceptors.push(function ($q) {
            return {
                'request': function (config) {
                    if (!~config.url.indexOf('views/') && !~config.url.indexOf('data/')){  //ignores ngRoute requests and static data files
                        config.url = 'proxy.php?url=' + config.url + '&mode=native';
                    }

                    return config || $q.when(config);
                }

            }
        });

        $httpProvider.defaults.headers.common['Accept'] = 'application/json, text/javascript, */*; q=0.01';
        $httpProvider.defaults.headers.common['Content-Type'] = 'application/json';

    }]);

angular.module('Authentication', []);