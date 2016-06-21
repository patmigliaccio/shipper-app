(function () {
    'use strict';
    
    var app = angular.module('ShipperApp');
    
    app.factory('ShipStation', ['$http', function($http){
        return {
            getOrders: function(){
                //TODO convert service to $resource
                return $http.get('https://ssapi.shipstation.com/orders?orderStatus=awaiting_shipment')
                        .then(function(response){
                            return response.data.orders;
                        }, function(error) {
                            console.log(error);
                        });
            }
        }

    }]);

})();