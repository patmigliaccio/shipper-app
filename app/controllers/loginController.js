(function () {
    'use strict';

    var app = angular.module('ShipperApp');

    app.controller('LoginCtrl',
        ['$scope', '$state', 'AuthenticationService', 'ModalService',
            function ($scope, $state, AuthenticationService, ModalService) {
                // reset login status
                AuthenticationService.ClearCredentials();

                $scope.showLogin = function (){
                    ModalService.showModal({
                        templateUrl: "app/views/loginModal.html",
                        controller: "LoginModalCtrl"
                    }).then(function(modal) {

                        modal.element.modal();
                        modal.close.then(function(result) {

                            if (result){
                                $state.go('orders')
                            }
                        });

                    });
                };

                //TODO Implement logout (only show if logged in)
                $scope.logout = function () {
                    AuthenticationService.ClearCredentials();
                };

            }]);

    app.controller('LoginModalCtrl',
        ['$scope', '$element', 'AuthenticationService', 'close',
            function($scope, $element, AuthenticationService, close) {

                $scope.login = function () {
                    $scope.dataLoading = true;
                    AuthenticationService.Login($scope.username, $scope.password, function (response) {
                        if (response.success) {
                            AuthenticationService.SetCredentials($scope.username, $scope.password);
                            $scope.error = null;
                            $scope.dataLoading = false;

                            var result = true; //for testing
                            close(result, 500); // close modal, but give 500ms for bootstrap to animate
                            $element.modal('hide'); // dirty fix for backdrop not hiding issue
                        } else {
                            $scope.error = response.message;
                            $scope.dataLoading = false;
                        }
                    });
                }

            }]);
})();