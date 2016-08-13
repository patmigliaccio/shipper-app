(function(){
    'use strict';

    OrdersService.$inject = ['$resource'];
    function OrdersService($resource){
        var root = 'orders';

        return $resource(root, {},
            {
                get: {
                    url: 'data/orders.json', //root + '/:id',
                    method: 'GET',
                    params: {
                        id: '@id'
                    }
                }
            });

    }

    StatusService.$inject = ['$http'];
    function StatusService($http){
        var promise;

        return {
            getStatuses: function(){
                if (!promise)
                    promise = $http.get('app/orders/order-statuses.json')
                                    .then(function(response){
                                        return response.data;
                                    });

                return promise;
            }
        }
    }

    StatusFactory.$inject = ['StatusService'];
    function StatusFactory(StatusService){
        var _defaultValue = 3;

        var statuses;

        var search = function(property, value) {
            if (value)
                for (var i = 0, len = statuses.length; i < len; i++) {
                    if (statuses[i][property] == value)
                        return statuses[i];
                }

            return null;
        }

        return {
            getAll: function(){
                return StatusService.getStatuses().then(function(response){
                        return statuses = response;
                    });
            },
            getByCode: function(code){
                return search('code', code) || this.getDefault();
            },
            getByValue: function(value){
                return search('value', value) || this.getDefault();
            },
            getDefault: function(){
                return this.getByValue(_defaultValue);
            }
        }
    }

    angular.module('orders')
        .factory('OrdersService', OrdersService)
        .factory('StatusService', StatusService)
        .factory('StatusFactory', StatusFactory)
})();