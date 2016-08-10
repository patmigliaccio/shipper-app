(function(){
    'use strict';

    var cfg = require('../config');

    function OrderItemFactory(){
        var OrderItem = function(id, category, quantity, weightValue, weightUnits){
            this.id = id;
            this.category = category;
            this.quantity = quantity;
            this.weight = weightValue;
            this.units = weightUnits;
        };

        OrderItem.prototype.ConvertWeightToPounds = function (){
            if (this.units == "pounds" || this.units == "lbs")
                return;

            if (this.units == "ounces" || this.units == "oz") {
                this.weight = this.weight / 16;
            }
        };

        OrderItem.Build = function (data){
            if (!data.hasOwnProperty('quantity')) data.quantity = 1;

            //split sku by categorized delimiter
            var product = data.sku.split('-');

            data = AdjustWeightsOfItemsWithWeightOption(data);
            data = AdjustWeightsOfSpecialItems(data, product[0]);

            return new OrderItem(
                product[1],
                product[0],
                data.quantity,
                data.weight.value,
                data.weight.unit
            );
        };

        function AdjustWeightsOfItemsWithWeightOption(item) {
            //set weight from attribute if it exists
            for (var opt in item.options) {
                if (item.options.hasOwnProperty(opt) && opt.hasOwnProperty(name)){
                    if (item.options[opt].name.toLowerCase() == "weight") {
                        var w = item.options[opt].value.split(' ');
                        item.weight.value = w[0];
                        item.weight.units = w[1];
                    }
                }
            }

            return item;
        }

        //special item value/units change
        function AdjustWeightsOfSpecialItems(item, productCategory){
            if (productCategory == cfg.specialItemSKUPrefix ) {
                if (item.weight.units == cfg.specialItemWeightUnits)
                    item.weight.value = cfg.specialItemNewWeight;
            }

            return item;
        }


        return OrderItem;
    }

    
    angular.module('orders')
        .factory('OrderItem', OrderItemFactory);
})();
