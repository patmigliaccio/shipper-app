(function(){
    'use strict';

    angular
        .module('totals')
        .controller('TotalsController', TotalsController);

    TotalsController.$inject = ['OrdersService', 'TotalsService', 'StatusFactory', 'usSpinnerService'];

    function TotalsController(OrdersService, TotalsService, StatusFactory, usSpinnerService){
        var vm = this;

        usSpinnerService.spin('spinner');

        var status = StatusFactory.getDefault();

        OrdersService.get({ orderStatus: status.code, pageSize: 500 },
            function(response){
                vm.totals = TotalsService.Process(response.orders);
                usSpinnerService.stop('spinner');
            });
    }

})();
