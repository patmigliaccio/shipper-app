(function(){
    'use strict';

    function SubSelectorController(){

    }

    function SubSelector(){
        return {
            restrict: 'E',
            bindToController: true,
            controllerAs: 'ss',
            controller: SubSelectorController
        }
    }

    function SubSelectee(){
        function link(scope, element, attrs, ctrl){

        }

        return {
            restrict: 'E',
            require: '^ss',
            link: link
        }
    }

    angular.module('subscriptions')
        .directive('subSelector', SubSelector)
        .directive('subSelectee', SubSelectee)
})();
