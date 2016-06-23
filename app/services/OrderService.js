(function (){
    'use strict';

    var app = angular.module('ShipperApp');

    app.factory('OrderService', ['$resource', function($resource) {
        var root = 'https://ssapi.shipstation.com/orders';

        return $resource(root, {},
            {
                get: {
                    url: root + '/:id',
                    method: 'GET',
                    params: {
                        id: '@id'
                    }
                },
                getAwaitingShipments: {
                    url: root,
                    method:'GET',
                    params: {
                        orderStatus: 'awaiting_shipment'
                    }
                }
            });


    }]);

})();