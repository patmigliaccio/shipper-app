angular.module('orders', ['resources.orders', 'services.totaling'])
    .config(['$stateProvider', function($stateProvider){
        $stateProvider
            .state('orders', {
                url: "/orders",
                templateUrl: "app/orders/orders-list.tpl.html",
                controller: "OrdersCtrl as oc"
            })
            .state('totals', {
                url: "/totals",
                templateUrl: "app/orders/orders-totals-list.tpl.html",
                controller: "TotalsCtrl as tc"
            });
    }])
    .controller('OrdersCtrl', 
        ['$scope', 'orders', 'usSpinnerService', 
            function ($scope, orders, usSpinnerService) {
                var oc = this;
                
                var init = function(){
                    orders.getStatuses().$promise
                        .then(function(response){
                            oc.statuses = response;
                            oc.status = oc.statuses[2]; //default status: Awaiting Shipment
                            oc.getOrders(oc.status);
                        });
                };
        
                oc.getOrders = function(status){
                    usSpinnerService.spin('spinner');
        
                    orders.get({ orderStatus: status.value },
                        function (response) {
                            oc.orders = $.map(response.orders, function (value) {
                                return [value];
                            });
        
                            usSpinnerService.stop('spinner');
                        });
                };
        
                oc.statusChange = function(){
                    oc.getOrders(oc.status);
                };
        
                init();
        
                //TODO add export function that simplifies oc.orders array
            }])

    .controller('TotalsCtrl', 
        ['$scope', 'orders', 'totalingService', 'usSpinnerService',
            function ($scope, orders, totalingService, usSpinnerService) {
                var tc = this;
        
                var init = function () {
                    usSpinnerService.spin('spinner');
        
                    orders.get({ orderStatus: 'awaiting_shipment', pageSize: 500 },
                        function(response){
                            tc.totals = totalingService.Process(response.orders);
                            usSpinnerService.stop('spinner');
                        });
                };
        
                init();

            }]);


String.prototype.isNumeric = function() {
    return !isNaN(parseFloat(this)) && isFinite(this);
};
