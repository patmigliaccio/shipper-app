angular.module('resources.orders', [])

    .factory('orders',
        ['$resource', function($resource) {
            var root = 'orders';

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