(function(){
    'use strict';

    angular
        .module('config', [])
        .constant('ConfigSettings', config);

    var config = {
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
    };

    module.exports = config;
})();