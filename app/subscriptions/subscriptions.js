(function(){
    'use strict';

    function SubscriptionsTotalsController(totals){
        var sc = this;

        if (totals)
            sc.totals = totals;
    }

    function SubscriptionsListController(totals, subscriptions){
        var slc = this;

/*        if (totals)
            sc.totals = totals;*/

        if (subscriptions)
            slc.subscriptions = subscriptions;
    }

    angular.module('subscriptions', [])
        .config(['$stateProvider', function($stateProvider){
            $stateProvider
                .state('subscriptions',{
                    url: '/subscriptions',
                    controller: SubscriptionsTotalsController,
                    controllerAs: 'sc',
                    templateUrl: 'app/subscriptions/subscriptions.tpl.html',
                    resolve: {
                        totals: ['SubscriptionsService', function(SubscriptionsService) {
                            return SubscriptionsService.getTotals()
                                .then(function(response){
                                    return response;
                                });
                        }]
                    }
                })
                .state('subscriptions.list',{
                    url: '/:status',
                    controller: SubscriptionsListController,
                    controllerAs: 'slc',
                    templateUrl: 'app/subscriptions/subscriptions-list.tpl.html',
                    resolve: {
                        subscriptions: ['SubscriptionsService', '$stateParams', function(SubscriptionsService, $stateParams){
                            if ($stateParams.status)
                                return SubscriptionsService.getByStatus($stateParams.status)
                                    .then(function(response){
                                       return response;
                                    });

                            return null;
                        }]
                    }
                })
        }]);
})();