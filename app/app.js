angular.module('ShipperApp', ['Authentication', 'ui.router', 'ngSanitize', 'ngResource', 'angularModalService', 'ngCsv'])
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider',
        function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

        $stateProvider
            .state('home', {
                url: "",
                templateUrl: "app/views/homeView.html",
                controller: "HomeCtrl as hc"
            })
            .state('orders', {
                url: "/orders",
                templateUrl: "app/views/ordersView.html",
                controller: "OrdersCtrl as oc"
            })
            .state('totals', {
                url: "/totals",
                templateUrl: "app/views/totalsView.html",
                controller: "TotalsCtrl as tc"
            });

        $urlRouterProvider.otherwise("/");

        //TODO get html5mode working
        $locationProvider.html5Mode(false).hashPrefix('!');

        //uses proxy for http requests
        $httpProvider.interceptors.push(function ($q) {
            return {
                'request': function (config) {
                    if (!~config.url.indexOf('.html') && !~config.url.indexOf('data/')){  //ignores ngRoute requests and static data files

                        //serializes parameters for proxy
                        var queryString = '';
                        if (typeof config.params !== "undefined"){
                            queryString = '?' + serialize(config.params);
                            delete config.params;
                        }

                        config.url = 'proxy.php?url=' + config.url + queryString + '&mode=native';
                    }

                    return config || $q.when(config);
                }
                //TODO modify response to check for unauthorized request
            }
        });

        $httpProvider.defaults.headers.common['Accept'] = 'application/json, text/javascript, */*; q=0.01';
        $httpProvider.defaults.headers.common['Content-Type'] = 'application/json';

    }]);

//serialize JSON into queryString
var serialize = function(obj) {
    var str = [];
    for(var p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return str.join("&");
};