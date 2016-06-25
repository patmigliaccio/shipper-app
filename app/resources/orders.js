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
                    getStatuses: {
                        url: 'app/resources/order-statuses.json',
                        method: 'GET',
                        isArray: true
                    }
                });

    }]);