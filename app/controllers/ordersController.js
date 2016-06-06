(function () {
    'use strict';

    var app = angular.module('ShipperApp');

    app.controller('OrdersCtrl', ['$scope', 'ShipStation', function ($scope, ShipStation) {
        var oc = this;

        ShipStation.getOrders()
            .then(function (data) {
                oc.orders = data;
            });

    }]);

})();