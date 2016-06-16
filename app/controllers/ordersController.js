(function () {
    'use strict';

    var app = angular.module('ShipperApp');

    app.controller('OrdersCtrl', ['$scope', 'ShipStation', function ($scope, ShipStation) {
        var oc = this;

        oc.getOrders = function(){
            ShipStation.getOrders()
                .then(function (data) {
                    oc.orders = $.map(data, function (value) {
                        return [value];
                    });
                });
        };

        var init = function(){
            oc.getOrders();
        }

        init();

        //TODO add export function that simplifies oc.orders array
    }]);

})();