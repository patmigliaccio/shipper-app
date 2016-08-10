//TODO refactoring & fix issue #2
(function (){
    'use strict';

    var cfg = require('./../config');

    TotalingService.$inject = ['Order', 'Total'];
    function TotalingService(Order, Total){
        var totals = [];

        return {

            AddToTotals: function (item) {
                var currentTotal;

                //find total in array if exists
                var totalsFiltered = totals.filter(function(total){
                    return total.itemName;
                });

                if (totalsFiltered.length > 0) {
                    currentTotal = totalsFiltered[0];
                } else {
                    currentTotal = new Total(item);
                }

                currentTotal.AddToWeight(item);
                currentTotal.SumProductCounts(item);
            },

            Process: function (data) {

                for (var order in data) {

                    var currentOrder = Order.Build(order);

                    for (var i = 0, len = currentOrder.orderItems.length; i < len; i++){
                        var item = currentOrder.orderItems[i];

                        item.ConvertWeightToPounds();

                        this.AddToTotals(item);
                    }

                }

                return ArraySortedByProductKey(totals);
            }
        }
    }


    //sort array based on product key order (only includes items in key)
    function ArraySortedByProductKey(totals){
        var sorted = [];
        for (var product in cfg.productKey) {
            for (var total in totals) {
                if (total.itemName.toUpperCase().indexOf(product) > -1) {
                    sorted.push(totals[total]);
                }
            }
        }

        return sorted;
    }

    // String.prototype.isNumeric = function() {
    //     return !isNaN(parseFloat(this)) && isFinite(this);
    // };

    angular.module('totals')
        .factory('TotalingService', TotalingService);
})();