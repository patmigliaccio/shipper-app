(function(){
    'use strict';

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

    angular.module('orders')
        .controller('OrdersCtrl', OrdersCtrl);

})();


