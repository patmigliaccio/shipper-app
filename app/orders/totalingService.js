angular.module('services.totaling', [])
    .constant('cfg', {
        productKey: { //product sku prefixes with corresponding items
            "XXXX":"Product #1"
        },

        //SETTINGS
        nestedItemSKUPrefix: "", //checks for nested options if sku begins with (default: "")
        specialCase: "", //adds item if option matches this (default: no match)
        removeParent: true, //removes parent item from list if nested item found (default: true)

        ignoredItemsSKUPrefix: "", //ignores item is sku begins with (default: "")

        specialItemSKUPrefix: "", //if item sku prefix is this (default: "")
        specialItemNewSKUPrefix: "", //replace it with this (default: "")
        specialItemWeightUnits: "lbs", // and if is in units of this (default: lbs)
        specialItemNewWeight: "", //give it a weight of this (default: 1)

        defaultProductWeight: "1", //sets a default weight for new nested products added (default: 1)
        defaultProductUnits: "ounces",//sets a default unit value for new nested products added (default: ounces)
        displayWeightAs: "lbs" //converts totals to this unit of measurement (default: lbs)
    })
    .factory('totalingService',
        ['cfg',
            function (cfg) {
                var totaling = {};

                //totals item weight values that have the same sku
                totaling.Process = function (orders) {
                    var totals = {};

                    var itemKey = cfg.productKey || []; //product sku prefixes with corresponding items

                    var ignoredItemsSKUPrefix = cfg.ignoredItemsSKUPrefix || ''; //ignores item is sku begins with

                    var nestedItemSKUPrefix = cfg.nestedItemSKUPrefix || ''; //checks for nested options if sku begins with
                    var specialCase = cfg.specialCase || 'a^'; //adds item if option matches this
                    var removeParent = cfg.removeParent; //removes parent item from list if nested item found

                    var specialItemSKUPrefix = cfg.specialItemSKUPrefix || ""; //if item sku prefix is this
                    var specialItemNewSKUPrefix = cfg.specialItemNewSKUPrefix || ""; //replace it with this
                    var specialItemWeightUnits = cfg.specialItemWeightUnits || "lbs"; // and if is in units of this
                    var specialItemNewWeight = cfg.specialItemNewWeight || "1"; //give it a weight of this

                    var productWeight = cfg.defaultProductWeight || '1'; //sets a default weight for new nested products added
                    var productUnits = cfg.defaultProductUnits || 'lbs'; //sets a default unit value for new nested products added
                    var weightFilter = cfg.displayWeightAs || 'lbs'; //converts totals to this unit of measurement

                    for (var x in orders) {

                        var items = [];
                        var itemLength = 0;
                        if (orders.hasOwnProperty(x)) {
                            items = orders[x].items;
                            itemLength = items.length;
                        }

                        for (var i = 0; i < itemLength; i++) {
                            var nestedItem = false;

                            //add items to array if there is more than one ordered in quantity
                            //will cause issues at scale for large orders of the same product
                            if (items[i].hasOwnProperty('quantity')) {
                                if (items[i].quantity > 1) {
                                    items[i].quantity--;
                                    items.push(items[i]);
                                    itemLength++;
                                }
                            }

                            var sku = items[i].sku;
                            //split sku by categorized delimiter
                            var product = sku.split('-');

                            //loop through options attributes of products for nested products
                            if (product[0] == nestedItemSKUPrefix) {
                                for (var o in items[i].options) {

                                    var itemOption;
                                    if (items[i].options.hasOwnProperty(o)) {
                                        itemOption = items[i].options[o];
                                    }

                                    var regex = new RegExp(specialCase, 'gi'); //case insensitive
                                    if (itemOption && itemOption.name.match(regex)) {

                                        var itemCode = Object.keys(itemKey).filter(function (key) {
                                            return itemKey[key] === itemOption.value
                                        })[0];

                                        items.push({
                                            name: itemOption.value,
                                            sku: itemCode,
                                            weight: {
                                                value: productWeight,
                                                units: productUnits
                                            },
                                            options: []
                                        });

                                        itemLength++;

                                        nestedItem = removeParent;
                                    }
                                }
                                //skip if ignored item sku or nested item
                            } else if (product[0] != ignoredItemsSKUPrefix && !nestedItem) {

                                //set weight from attribute if it exists
                                for (var opt in items[i].options) {
                                    if (items[i].options[opt].name.toLowerCase() == "weight") {
                                        var w = items[i].options[opt].value.split(' ');
                                        items[i].weight.value = w[0];
                                        items[i].weight.units = w[1];
                                    }
                                }

                                //special item value/units change
                                if (product[0] == specialItemSKUPrefix) {
                                    product[0] = specialItemNewSKUPrefix;

                                    if (items[i].weight.units == specialItemWeightUnits) items[i].weight.value = specialItemNewWeight;
                                }

                                //if sku not already in final array add it
                                if (!totals[product[0]]) {
                                    var itemName = itemKey[product[0]] || product[0];

                                    totals[product[0]] = {
                                        item_name: itemName,
                                        //item_sku: product[0],
                                        ounce_count: 0,
                                        pound_count: 0,
                                        sub_count: 0,
                                        total_weight: 0,
                                        item_weight_units: weightFilter
                                    };
                                }

                                //sum different product types by second half of sku naming convention
                                if (product[1]) {
                                    //first char is number vs. letter (e.g. XXXX-0000 vs. XXXX-A000)
                                    var firstChar = product[1].charAt(0);
                                    if (firstChar.isNumeric()) {
                                        items[i].weight.units == "ounces" || items[i].weight.units == "oz" ? totals[product[0]].ounce_count++ : totals[product[0]].pound_count++;
                                    } else {
                                        totals[product[0]].sub_count++;
                                    }
                                } else { //no second half exists
                                    totals[product[0]].ounce_count++
                                }

                                //convert ounces to pounds if filter is set to lbs
                                if ((items[i].weight.units == "ounces" || items[i].weight.units == "oz") && weightFilter == "lbs") {
                                    items[i].weight.value = Number(items[i].weight.value) / 16;
                                }

                                //adds weight to total
                                totals[product[0]].total_weight += Number(items[i].weight.value);
                            }
                        }

                    }

                    //sort array based on product key order
                    var outTotals = [];
                    for (var item in itemKey) {
                        for (var obj in totals) {
                            if (obj.toUpperCase().indexOf(item) > -1) {
                                outTotals.push(totals[obj]);
                            }
                        }
                    }

                    return outTotals;
                };

                return totaling;
            }]);