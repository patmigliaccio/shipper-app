(function(){
    'use strict';

    function SubscriptionsService($http){
        return {
            getTotals: function(){
                return $http.get('app/resources/subscription-totals.json') //Dummy Data in JSON
                    .then(function(response){
                        return response.data;
                    });

            },
            getByStatus: function(status){
                return $http.get('app/resources/subscription-' + status + '.json') //Dummy Data in JSON
                    .then(function(response){
                        return response.data;
                    });
            }
        }
    }

    angular.module('subscriptions')
        .factory('SubscriptionsService', ['$http', SubscriptionsService]);
})();

