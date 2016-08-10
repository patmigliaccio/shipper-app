(function(){
    'use strict';

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

    angular.module('totals')
        .controller('TotalsCtrl', TotalsCtrl);

})();
