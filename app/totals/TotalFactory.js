(function (){
    'use strict';

    function TotalFactory(){
        var Total = function(item){
            this.itemName = item.name;
            this.ounceCount = 0;
            this.poundCount = 0;
            this.subscriptionCount = 0;
            this.totalWeight = 0;
            this.units = item.units;

            AddToWeight(item);
            SumProductCounts(item);
        };

        Total.prototype.AddToWeight = function (item){
            this.totalWeight += item.weight;
        };

        Total.prototype.SumProductCounts = function(item){
            //sum different product types by second half of sku naming convention
            if (item.id) {
                //first char is number vs. letter (e.g. XXXX-0000 vs. XXXX-A000)
                var firstChar = item.id.charAt(0);
                if (firstChar.isNumeric()) {
                    item.units == "ounces" || item.units == "oz" ? this.ounceCount++ : this.poundCount++;
                } else {
                    this.subscriptionCount++;
                }
            } else { //no second half exists
                this.ounceCount++;
            }
        };

        return Total;
    }

    angular.module('totals')
        .factory('Total', TotalFactory);
})();