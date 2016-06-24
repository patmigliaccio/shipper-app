angular.module('ShipperApp', [
    'ui.router',
    'ngSanitize',
    'ngResource',
    'ngCsv',
    'services.interceptor',
    'home',
    'login',
    'orders'])
    
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider',
        function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

        $stateProvider
            .state('home', {
                url: "/",
                templateUrl: "app/home/home.tpl.html",
                controller: "HomeCtrl as hc"
            })
            .state('orders', {
                url: "/orders",
                templateUrl: "app/orders/orders-list.tpl.html",
                controller: "OrdersCtrl as oc"
            })
            .state('totals', {
                url: "/totals",
                templateUrl: "app/orders/orders-totals-list.tpl.html",
                controller: "TotalsCtrl as tc"
            });

        $urlRouterProvider.otherwise("/");

        //TODO get html5mode working
        $locationProvider.html5Mode(false).hashPrefix('!');

        $httpProvider.interceptors.push('interceptor');

        $httpProvider.defaults.headers.common['Accept'] = 'application/json, text/javascript, */*; q=0.01';
        $httpProvider.defaults.headers.common['Content-Type'] = 'application/json';

    }])
    
    .controller('AppCtrl', ['$scope', '$state', '$rootScope', function ($scope, $state, $rootScope) {
        $rootScope.$on('unauthorized', function() {
            $state.go('home'); //TODO prompt user for login if unauthorized
        });
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