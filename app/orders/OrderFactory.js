(function() {
    'use strict';

    var cfg = require('../config');

    OrderFactory.$inject = ['OrderItem'];
    function OrderFactory(OrderItem){

        var Order = function() {
            this.orderItems = [];
        };

        Order.prototype.AddItem = function (item) {
            this.orderItems.push(item);
        };

        Order.Build = function (data) {
            var items = data.items;

            for (var i = 0, len = items.length; i < len; i++) {
                var currentItem = items[i];

                //loop through options attributes of products for nested products and skip adding of parent
                if (currentItem.category == cfg.nestedItemSKUPrefix) {

                    var newItems = ExtractNestedItems(currentItem);
                    var nLen = newItems.length;
                    if (nLen > 0) {
                        for (var n = 0; n < nLen; n++)
                            items.push(newItems[n]);
                        len += nLen;
                    }

                } else {

                    this.AddItem(OrderItem.Build(currentItem));

                }

            }
        };

        function ExtractNestedItems(currentItem) {
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

        return Order;
    }

    angular.module('orders')
        .factory('Order', OrderFactory);
})();