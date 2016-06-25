angular.module('orders', ['resources.orders'])
    .constant('totalsConfig', {
            specialCase: "{{ ItemName }}", //adds items from nested options
            removeParent: true //removes parent item from list if nested item found
        })

    .controller('OrdersCtrl', ['$scope', 'orders', function ($scope, orders) {
        var oc = this;
        
        var init = function(){
            orders.getStatuses().$promise
                .then(function(response){
                    oc.statuses = response;
                    oc.status = oc.statuses[2]; //default status: Awaiting Shipment
                    oc.getOrders(oc.status);
                });
        };

        oc.getOrders = function(status){
            orders.get({ orderStatus: status.value },
                function (response) {
                    oc.orders = $.map(response.orders, function (value) {
                        return [value];
                    });
                });
        };

        oc.statusChange = function(){
            oc.getOrders(oc.status);
        };

        init();

        //TODO add export function that simplifies oc.orders array
    }])

    .controller('TotalsCtrl', ['$scope', 'orders', 'totalsConfig', function ($scope, orders, totalsConfig) {
        var tc = this;

        var specialCase = totalsConfig.specialCase; //adds items from nested options
        var removeParent = totalsConfig.removeParent; //removes parent item from list if nested item found

        var init = function () {

            orders.get({ orderStatus: 'awaiting_shipment' },
                function(response){
                    tc.totals = tc.Process(response.orders);
                });

        };

        //totals item weight values that have the same sku
        tc.Process = function (orders) {
            var v = {};

            for (var x in orders) {

                var items = [];
                if (orders.hasOwnProperty(x)) {
                    items = orders[x].items;
                }

                var itemLength = items.length;

                for (var i = 0; i < itemLength; i++) {

                    //special case for products nested in options
                    var skipItem = false;
                    for(var o in items[i].options){
                        var option = {};

                        if (items[i].options.hasOwnProperty(o)) {
                            option = items[i].options[o];
                        }

                        if (option.name.toLowerCase().indexOf(specialCase.toLowerCase()) > -1){ //case insensitive

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

        init();

        //TODO add export function that simplifies and sorts the tc.totals array
    }]);
