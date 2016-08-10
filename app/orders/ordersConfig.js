(function(){
    'use strict';

    OrdersConfig.$inject = ['$stateProvider'];
    function OrdersConfig($stateProvider){
        $stateProvider
            .state('orders', {
                url: "/orders",
                params: {
                    status: null
                },
                templateUrl: "app/orders/orders-list.tpl.html",
                controller: "OrdersCtrl as oc",
                resolve: {
                    status: ['$stateParams', 'StatusFactory', function($stateParams, StatusFactory){
                        return StatusFactory.getAll()
                            .then(function(){
                                return StatusFactory.getByValue($stateParams.status); //if falsy returns default status
                            });
                    }]
                }
            });
    }

    angular.module('orders', [])
        .config(OrdersConfig);

})();


