(function () {
    'use strict';

    var app = angular.module('ShipperApp');

    app.controller('TotalsCtrl', ['$scope', 'ShipStation', function ($scope, ShipStation) {
        var tc = this;

        var specialCase = '{{ ItemName }}'; //adds items from nested options
        var removeParent = true; //removes parent item from list if nested item found

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
                var itemLength = items.length;

                for (var i = 0; i < itemLength; i++) {

                    //special case for products nested in options
                    var skipItem = false;
                    for(var o in items[i].options){
                        var option = items[i].options[o];

                        if (option.name.indexOf(specialCase) > -1){

                            items.push({
                                name: option.value,
                                weight: {
                                    value: '12',
                                    units: 'ounces'
                                },
                                options: []
                            });

                            itemLength++;
                            
                            skipItem = removeParent && true;
                        }
                    }

                    if (!skipItem && items[i].weight.value > 0){
                        if (!v[items[i].name]) {
                            v[items[i].name] = {
                                item_name: items[i].name,
                                total_weight: 0,
                                item_weight_units: "lbs"
                            };
                        }

                        //converts ounces to pounds
                        if (items[i].weight.units == "ounces") {
                            items[i].weight.value = Number(items[i].weight.value) / 16;
                        }

                        v[items[i].name].total_weight += Number(items[i].weight.value);
                    }
                    
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