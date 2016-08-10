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

    angular.module('totals', [])
        .config(TotalsConfig)
})();
