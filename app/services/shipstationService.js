(function () {
    'use strict';

    //TODO setup authService along with login as a modal and pass in header then read in proxy
    var authKey = "{{ AuthKey }}";
    
    var app = angular.module('ShipperApp');

    //TODO move headers to $httpProvider
    var config = {
        'Authorization': 'Basic ' + authKey,
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Content-Type': 'application/json'
    };
    
    app.factory('ShipStation', ['$http', function($http){
        return {
            getOrders: function(){
                return $http.get('https://ssapi.shipstation.com/orders?orderStatus=awaiting_shipment') // data/orders.json (for static)
                        .then(function(response){
                            return response.data.orders;
                        }, function(error) {
                            console.log(error);
                        });
            }
        }

    }]);

})();