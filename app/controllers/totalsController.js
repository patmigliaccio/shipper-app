(function () {
    'use strict';

    var app = angular.module('ShipperApp');

    app.controller('TotalsCtrl', ['$scope', 'ShipStation', function ($scope, ShipStation) {
        var tc = this;

        tc.Initialize = function () {
            var orders;

            ShipStation.getOrders()
                .then(function (data) {
                    orders = data;

                    tc.totals = tc.Process(orders);
                });
        };

        //totals item weight values that have the same sku
        tc.Process = function (orders) {
            var v = {};

            for (var x in orders) {
                var items = orders[x].items;

                for (var i in items) {
                    if (!v[items[i].sku]) {
                        v[items[i].sku] = {
                            item_name: items[i].name,
                            item_sku: items[i].sku,
                            total_weight: 0,
                            item_weight_units: items[i].weight.units
                        };
                    }

                    v[items[i].sku].total_weight += Number(items[i].weight.value);
                }
            }

            return $.map(v, function (value) {
                return [value];
            });
        };

        tc.Initialize();
        
        //TODO add export function that simplifies and sorts the tc.totals array
    }]);

})();