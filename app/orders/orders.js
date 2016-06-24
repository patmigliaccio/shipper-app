angular.module('orders', ['services.orders'])

    .controller('OrdersCtrl', ['$scope', 'orders', function ($scope, orders) {
        var oc = this;

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
        
        var init = function(){
            oc.statuses =[
                {name: 'Awaiting Payment', value: 'awaiting_payment'},
                {name: 'On Hold', value: 'on_hold'},
                {name: 'Awaiting Shipment', value: 'awaiting_shipment'},
                {name: 'Pending Fulfillment', value: 'pending_fulfillment'},
                {name: 'Shipped', value:'shipped'}];
            oc.status = oc.statuses[2];
            oc.getOrders(oc.status);
        };

        init();

        //TODO add export function that simplifies oc.orders array
    }])

    .controller('TotalsCtrl', ['$scope', 'orders', function ($scope, orders) {
        var tc = this;

        var specialCase = '{{ ItemName }}'; //adds items from nested options
        var removeParent = true; //removes parent item from list if nested item found

        tc.Initialize = function () {

            orders.getAwaitingShipments().$promise
                .then(function(response){
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
