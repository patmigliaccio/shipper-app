angular.module('ShipperApp', ['Authentication', 'ngRoute', 'ngSanitize', 'angularModalService', 'ngCsv'])
    .config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/views/homeView.html',
                controller: 'HomeCtrl',
                controllerAs: 'hc'
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
            .otherwise('/');

        //TODO get html5mode working
        $locationProvider.html5Mode(false).hashPrefix('!');

        //uses proxy for http requests
        $httpProvider.interceptors.push(function ($q) {
            return {
                'request': function (config) {
                    if (!~config.url.indexOf('.html') && !~config.url.indexOf('data/')){  //ignores ngRoute requests and static data files
                        config.url = 'proxy.php?url=' + config.url + '&mode=native';
                    }

                    return config || $q.when(config);
                }

            }
        });

        $httpProvider.defaults.headers.common['Accept'] = 'application/json, text/javascript, */*; q=0.01';
        $httpProvider.defaults.headers.common['Content-Type'] = 'application/json';

    }]);