(function () {
    'use strict';
    var authKey = "{{ AuthKey }}";
    
    var app = angular.module('ShipperApp');

    var config = {
        'Authorization': 'Basic ' + authKey,
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Content-Type': 'application/json'
    };

    app.factory('ShipStation', ['$http', function($http){
        return {
            getOrders: function(){
                return $http({
                    url: 'data/orders.json',
                    method: 'GET',
                    withCredentials: true,
                    headers: config
                })
                .then(function(response){
                    return response.data.orders;
                }, function(error) {
                    console.log(error);
                });
            }
        }

    }]);

})();