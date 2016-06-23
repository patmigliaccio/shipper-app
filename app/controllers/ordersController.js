(function () {
    'use strict';

    var app = angular.module('ShipperApp');

    app.controller('OrdersCtrl', ['$scope', 'OrderService', function ($scope, OrderService) {
        var oc = this;

        oc.getOrders = function(){
            OrderService.get({ orderStatus: 'awaiting_shipment' },
                function (response) {
                    oc.orders = $.map(response.orders, function (value) {
                        return [value];
                    });
                });
        };

        var init = function(){
            oc.getOrders();
        };

        init();

        //TODO add export function that simplifies oc.orders array
    }]);

})();