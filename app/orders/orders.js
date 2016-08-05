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
                resolve: OrdersCtrl.resolve
            });
    }

    OrdersCtrl.$inject = ['status', 'OrdersService', 'StatusFactory', 'usSpinnerService'];
    function OrdersCtrl(status, OrdersService, StatusFactory, usSpinnerService){
        var oc = this;
        oc.status = status;

        var init = function(){
            StatusFactory.getAll().
            then(function(response){
                oc.statuses = response;
            });

            oc.getOrders(oc.status);
        }

        oc.getOrders = function(status){
            usSpinnerService.spin('spinner');

            OrdersService.get({ orderStatus: status.code },
                function (response) {
                    oc.orders = $.map(response.orders, function (value) {
                        return [value];
                    });

                    usSpinnerService.stop('spinner');
                });
        };

        oc.statusChange = function(){
            oc.getOrders(oc.status);
        };

        init();

        //TODO add export function that simplifies oc.orders array
    }

    OrdersCtrl.resolve = {
        status: ['$stateParams', 'StatusFactory', function($stateParams, StatusFactory){
            return StatusFactory.getAll()
                        .then(function(){
                            return StatusFactory.getByValue($stateParams.status); //if falsy returns default status
                        });
        }]
    }

    angular.module('orders', [])
        .config(OrdersConfig)
        .controller('OrdersCtrl', OrdersCtrl);

})();


