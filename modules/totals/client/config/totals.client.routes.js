(function(){
    'use strict';

    angular
        .module('totals')
        .config(routeConfig);

    routeConfig.$inject = ['$stateProvider'];

    function routeConfig($stateProvider){
        $stateProvider
            .state('totals', {
                url: "/totals",
                templateUrl: "modules/totals/client/views/list-totals.client.view.html",
                controller: "TotalsController",
                controllerAs: "vm"
            });
    }

})();
