(function(){
    'use strict';

    TotalsConfig.$inject = ['$stateProvider'];
    function TotalsConfig($stateProvider){
        $stateProvider
            .state('totals', {
                url: "/totals",
                templateUrl: "app/totals/totals-list.tpl.html",
                controller: "TotalsCtrl as tc"
            });
    }

    TotalsCtrl.$inject = ['OrdersService', 'TotalingService', 'StatusFactory', 'usSpinnerService'];
    function TotalsCtrl(OrdersService, TotalingService, StatusFactory, usSpinnerService){
        var tc = this;

        usSpinnerService.spin('spinner');

        var status = StatusFactory.getDefault();

        OrdersService.get({ orderStatus: status.code, pageSize: 500 },
            function(response){
                tc.totals = TotalingService.Process(response.orders);
                usSpinnerService.stop('spinner');
            });
    }

    angular.module('totals', [])
        .config(TotalsConfig)
        .controller('TotalsCtrl', TotalsCtrl);

})();
