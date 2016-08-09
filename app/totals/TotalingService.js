//TODO refactoring & fix issue #2
(function (){
    'use strict';

    var cfg = require('./totals-config');

    function TotalingService(){
        var totals = {};

        return {
            GetTotals: function () {
                return totals;
            },

            //totals item weight values that have the same sku
            Process: function (allOrders) {

                for (var order in allOrders) {

                    if (!allOrders.hasOwnProperty(order)) {
                        return;
                    }

                    var items = orders[order].items;

                    for (var i = 0, len = items.length; i < len; i++) {
                        var currentItem = items[i];

                        //add items to array if there is more than one ordered in quantity
                        //will cause issues at scale for large orders of the same product
                        //issue #2 resides here
                        if (currentItem.hasOwnProperty('quantity')) {
                            if (currentItem.quantity > 1) {
                                currentItem.quantity--;
                                items.push(currentItem);
                                len++;
                            }
                        }

                        //split sku by categorized delimiter
                        var product = currentItem.sku.split('-');
                        var productCategory = product[0];
                        var productID = product[1];

                        //loop through options attributes of products for nested products
                        if (productCategory == cfg.nestedItemSKUPrefix) {

                            var nestedItems = ExtractNestedItemsFromOptionsAttribute(currentItem);
                            if (nestedItems && nestedItems.length > 0) {
                                items.splice(items.indexOf(currentItem), 1);
                                items = items.concat(nestedItems);
                                len += nestedItems.length;
                            }

                        } else if (productCategory != cfg.ignoredItemsSKUPrefix) {

                            currentItem = AdjustWeightsOfItemsWithWeightOption(currentItem);
                            currentItem = AdjustWeightsOfSpecialItems(currentItem, productCategory);
                            totals = AddNewItemsToTotalsArray(currentItem, productCategory);
                            totals = SumProductCounts(productID, productCategory, totals)

                            currentItem = ConvertWeightUnits(currentItem);

                            //adds weight to total
                            totals[productCategory].total_weight += Number(currentItem.weight.value);
                        }
                    }

                }

                return ArraySortByProductKey(totals, cfg.productKey);
            }
        }
    }


    function ExtractNestedItemsFromOptionsAttribute(currentItem){
        var additionalItems = [];

        for (var option in currentItem.options) {

            if (currentItem.options.hasOwnProperty(option)) {
                var itemOption = currentItem.options[option];

                var regex = new RegExp(cfg.specialCase, 'gi'); //case insensitive
                if (itemOption && itemOption.name.match(regex)) {

                    var itemCode = Object.keys(cfg.productKey).filter(function (key) {
                        return cfg.productKey[key] === itemOption.value
                    })[0];

                    additionalItems.push({
                        name: itemOption.value,
                        sku: itemCode,
                        weight: {
                            value: cfg.defaultProductWeight,
                            units: cfg.defaultProductUnits
                        },
                        options: []
                    });

                }
            }
        }

        return additionalItems;
    }


    function AdjustWeightsOfItemsWithWeightOption(currentItem) {
        //set weight from attribute if it exists
        for (var opt in currentItem.options) {
            if (currentItem.options.hasOwnProperty(opt) && opt.hasOwnProperty(name)){
                if (currentItem.options[opt].name.toLowerCase() == "weight") {
                    var w = currentItem.options[opt].value.split(' ');
                    currentItem.weight.value = w[0];
                    currentItem.weight.units = w[1];
                }
            }
        }

        return currentItem;
    }

    //special item value/units change
    function AdjustWeightsOfSpecialItems(currentItem, productCategory){
        if (productCategory == cfg.specialItemSKUPrefix ) {
            if (currentItem.weight.units == cfg.specialItemWeightUnits)
                currentItem.weight.value = cfg.specialItemNewWeight;
        }

        return currentItem;
    }

    function AddNewItemsToTotalsArray(totals, productCategory){
        //if sku not already in final array add it
        if (!totals[productCategory]) {
            var itemName = cfg.productKey[productCategory] || productCategory;

            totals[productCategory] = {
                item_name: itemName,
                ounce_count: 0,
                pound_count: 0,
                sub_count: 0,
                total_weight: 0,
                item_weight_units: cfg.displayWeightAs
            };
        }
        
        return totals;
    }

    function SumProductCounts(productID, productCategory, totals){
        //sum different product types by second half of sku naming convention
        if (productID) {
            //first char is number vs. letter (e.g. XXXX-0000 vs. XXXX-A000)
            var firstChar = productID.charAt(0);
            if (firstChar.isNumeric()) {
                currentItem.weight.units == "ounces" || currentItem.weight.units == "oz" ? totals[productCategory].ounce_count++ : totals[productCategory].pound_count++;
            } else {
                totals[productCategory].sub_count++;
            }
        } else { //no second half exists
            totals[productCategory].ounce_count++
        }

        return totals;
    }

    function ConvertWeightUnits(currentItem){
        //convert ounces to pounds if filter is set to lbs
        if ((currentItem.weight.units == "ounces" || currentItem.weight.units == "oz") && cfg.displayWeightAs == "lbs") {
            currentItem.weight.value = Number(currentItem.weight.value) / 16;
        }

        return currentItem;
    }

    //sort array based on product key order
    function ArraySortByProductKey(totals, itemKey){
        var outTotals = [];
        for (var item in itemKey) {
            for (var obj in totals) {
                if (obj.toUpperCase().indexOf(item) > -1) {
                    outTotals.push(totals[obj]);
                }
            }
        }

        return outTotals;
    }

    String.prototype.isNumeric = function() {
        return !isNaN(parseFloat(this)) && isFinite(this);
    };

    angular.module('totals')
        .factory('TotalingService', TotalingService);
})();