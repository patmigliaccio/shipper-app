angular.module('orders', ['resources.orders'])
    .constant('totalsConfig', {
            specialCase: "{{ ItemName }}", //adds items from nested options
            removeParent: true, //removes parent item from list if nested item found
            defaultProductWeight: "12", //sets a default weight for new nested products added
            defaultProductUnits: "ounces",//sets a default unit value for new nested products added
            displayWeightAs: "lbs" //converts totals to this unit of measurement
        })

    .controller('OrdersCtrl', 
        ['$scope', 'orders', 'usSpinnerService', 
            function ($scope, orders, usSpinnerService) {
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
                    usSpinnerService.spin('spinner');
        
                    orders.get({ orderStatus: status.value },
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
            }])

    .controller('TotalsCtrl', 
        ['$scope', 'orders', 'totalsConfig', 'usSpinnerService', 
            function ($scope, orders, totalsConfig, usSpinnerService) {
                var tc = this;
        
                var init = function () {
                    usSpinnerService.spin('spinner');
        
                    orders.get({ orderStatus: 'awaiting_shipment' },
                        function(response){
                            tc.totals = tc.Process(response.orders);
                            usSpinnerService.stop('spinner');
                        });
        
                };
        
                //totals item weight values that have the same sku
                tc.Process = function (orders) {
                    var v = {};
        
                    var specialCase = totalsConfig.specialCase; //adds items from nested options
                    var removeParent = totalsConfig.removeParent; //removes parent item from list if nested item found
                    var productWeight = totalsConfig.defaultProductWeight; //sets a default weight for new nested products added
                    var productUnits = totalsConfig.defaultProductUnits; //sets a default unit value for new nested products added
                    var weightFilter = totalsConfig.displayWeightAs; //converts totals to this unit of measurement
        
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
        
                                var regex = new RegExp( specialCase, 'gi' ); //case insensitive
                                if (option.name.match(regex)){
        
                                    items.push({
                                        name: option.value,
                                        weight: {
                                            value: productWeight,
                                            units: productUnits
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
                                        item_weight_units: weightFilter
                                    };
                                }
        
                                //converts ounces to pounds
                                if (items[i].weight.units == "ounces" && weightFilter == "lbs") {
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
