(function (){
    'use strict';
    var authKey = "NjMwZGVlNWYzMjRjNGQ5ZGJjMTA4NDdmODU3Y2EyYzQ6NGM1Nzg1NjNlN2ZiNDU3OThjZTZkNDFlOTZjNWFkODE=";
    
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
                    url: 'https://ssapi.shipstation.com/orders',
                    method: 'GET',
                    withCredentials: true,
                    headers: config
                })
                .then(function(response){
                    return response.orders;
                }, function(error) {
                    console.log(error);
                });
            }
        }

    }]);

})();