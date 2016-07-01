angular.module('orders', ['resources.orders'])
    .constant('cfg', {
            specialCase: "{{ ItemName }}", //adds items from nested options
            removeParent: true, //removes parent item from list if nested item found

            nameReplacePattern: "gift|subscription", //removes these values from item names

            specialItemName: "{{ ItemName }}", //if item name matches this
            specialItemNewName: "{{ ItemName }}", //replaces it with this
            specialItemWeight: "5lb|5 lb", //if special item weight matches this
            specialItemNewWeight: "3.6", //replace it with this
            specialItemNewWeightUnits: "lbs", //and unit with these

            ignoreItemsNameWith: "{{ IgnoredItem(s) }}", //does not total items that match these keys

            defaultProductWeight: "12", //sets a default weight for new nested products added
            defaultProductUnits: "ounces",//sets a default unit value for new nested products added
            displayWeightAs: "lbs", //converts totals to this unit of measurement

            productSortOrder: [
            ]
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
        ['$scope', 'orders', 'cfg', 'usSpinnerService',
            function ($scope, orders, cfg, usSpinnerService) {
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
        
                    var specialCase = cfg.specialCase; //adds items from nested options
                    var removeParent = cfg.removeParent; //removes parent item from list if nested item found
                    var productWeight = cfg.defaultProductWeight; //sets a default weight for new nested products added
                    var productUnits = cfg.defaultProductUnits; //sets a default unit value for new nested products added
                    var weightFilter = cfg.displayWeightAs; //converts totals to this unit of measurement

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
                                        sku: option.value,
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

                            var ignoreItem = new RegExp(cfg.ignoreItemsNameWith, 'gi');

                            //if not a nested option and weight is more than 0 and not an ignored item
                            if (!skipItem && items[i].weight.value > 0 && !items[i].name.match(ignoreItem)) {
                                //if name contains regex remove words
                                var pattern = new RegExp(cfg.nameReplacePattern, 'gi'); //case insensitive
                                var itemName = items[i].name.replace(pattern, "").trim();

                                var itemSKU = items[i].sku;

                                //if item name matches regex replace entire name
                                var nameRegex = new RegExp(cfg.specialItemName, 'gi');
                                if (itemName.match(nameRegex)) {
                                    itemName = cfg.specialItemNewName;

                                    //if sku contains regex change to new weight
                                    var skuRegex = new RegExp(cfg.specialItemWeight, 'gi');
                                    if (itemSKU.match(skuRegex)) {
                                        items[i].weight.value = cfg.specialItemNewWeight;
                                        items[i].weight.units = cfg.specialItemNewWeightUnits;
                                    }
                                }

                                //if not already in final array add it
                                if (!v[itemName]) {
                                    v[itemName] = {
                                        item_name: itemName,
                                        twelve_ounce_count: 0,
                                        five_pound_count: 0,
                                        twelve_sub_count: 0,
                                        five_sub_count: 0,
                                        total_weight: 0,
                                        item_weight_units: weightFilter
                                    };
                                }

                                //sum different product types
                                if (itemSKU.indexOf('Subscription') > -1 || itemSKU.indexOf('Sub') > -1) {
                                    if (itemSKU.indexOf('5lb') > -1 || itemSKU.indexOf('5 lb') > -1) {
                                        v[itemName].five_sub_count++;
                                    } else {
                                        v[itemName].twelve_sub_count++;
                                    }
                                } else {
                                    if (itemSKU.indexOf('5lb') > -1 || itemSKU.indexOf('5 lb') > -1) {
                                        v[itemName].five_pound_count++;
                                    } else {
                                        v[itemName].twelve_ounce_count++;
                                    }
                                }

                                //convert ounces to pounds if filter is set to lbs
                                if (items[i].weight.units == "ounces" && weightFilter == "lbs") {
                                    items[i].weight.value = Number(items[i].weight.value) / 16;
                                }

                                //adds weight to total
                                v[itemName].total_weight += Number(items[i].weight.value);
                            }
                        }
        
                    }

                    var sortKey = cfg.productSortOrder;

                    //sort object and put in array
                    var totals = [];
                    for (var k = 0; i < sortKey.length; i++){
                        for(var product in v){
                            if (v[product].item_name.toLowerCase().indexOf(sortKey[k]) > -1){
                                totals.push(v[product]);
                            }
                        }
                    }

                    //TODO catch values not in sort key
                    //TODO move sorting to a filter

                    return totals;
                };
        
                init();
        
                //TODO add export function that simplifies and sorts the tc.totals array
            }]);
