(function () {
    'use strict';

    angular.module('ShipperApp')
        .controller('LoginCtrl',
            ['$scope', '$rootScope', '$location', 'AuthenticationService',
                function ($scope, $rootScope, $location, AuthenticationService) {
                    // reset login status
                    AuthenticationService.ClearCredentials();

                    $scope.login = function () {
                        $scope.dataLoading = true;
                        AuthenticationService.Login($scope.username, $scope.password, function (response) {
                            if (response.success) {
                                AuthenticationService.SetCredentials($scope.username, $scope.password);
                                $location.path('/orders');
                                $scope.error = null;
                                $scope.dataLoading = false;
                            } else {
                                $scope.error = response.message;
                                $scope.dataLoading = false;
                            }
                        });
                    };

                    //TODO Implement logout
                    $scope.logout = function () {
                        AuthenticationService.ClearCredentials();
                    };

                }]);
})();