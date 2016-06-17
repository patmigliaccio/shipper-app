(function () {
    'use strict';
    
    var app = angular.module('ShipperApp');
    
    app.factory('ShipStation', ['$http', function($http){
        return {
            getOrders: function(){
                return $http.get('https://ssapi.shipstation.com/orders?orderStatus=awaiting_shipment')   //('data/orders.json')
                        .then(function(response){
                            return response.data.orders;
                        }, function(error) {
                            console.log(error);
                        });
            }
        }

    }]);

})();