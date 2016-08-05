'use strict';

var angular = require('angular');
require('./libs');

angular.module('ShipperApp', [
    'ui.router',
    'ngSanitize',
    'ngResource',
    'ngCsv',
    'ngCookies',
    'angularSpinner',
    'angular-storage',
    'services.interceptor',
    'services.authentication',
    'home',
    'login',
    'orders'])
    
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'storeProvider', '$httpProvider',
        function ($stateProvider, $urlRouterProvider, $locationProvider, storeProvider, $httpProvider) {

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

        //TODO setup html5mode
        $locationProvider.html5Mode(false).hashPrefix('!');

        storeProvider.setStore('cookieStorage');

        $httpProvider.interceptors.push('interceptor');

        $httpProvider.defaults.headers.common['Accept'] = 'application/json, text/javascript, */*; q=0.01';
        $httpProvider.defaults.headers.common['Content-Type'] = 'application/json';

    }])

    .run(['$rootScope', 'store', 'authentication',
        function ($rootScope, store, authentication) {
            //authenticate user if credentials stored
            $rootScope.globals = store.get('globals') || {};

            if ($rootScope.globals.authData) {
                authentication.SetAuthorization($rootScope.globals.authData);
            }
        }])

    .controller('AppCtrl', ['$scope', '$rootScope', '$state', 'authentication', 'usSpinnerService',
        function ($scope, $rootScope, $state, authentication, usSpinnerService) {
            $rootScope.$on('unauthorized', function() {
                authentication.ClearCredentials();
                $state.go('home'); //TODO prompt user with login modal if unauthorized
                usSpinnerService.stop('spinner');
            });
        }]);

require('./services');
require('./resources');
require('./home');
require('./login');
require('./orders');
