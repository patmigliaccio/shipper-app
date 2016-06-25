angular.module('login', ['services.authentication', 'angularModalService'])

    .controller('LoginCtrl',
        ['$scope', '$state', 'authentication', 'ModalService',
            function ($scope, $state, authentication, ModalService) {
                // reset login status
                authentication.ClearCredentials();

                $scope.showLogin = function (){
                    ModalService.showModal({
                        templateUrl: "app/login/login-modal.tpl.html",
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
                    authentication.ClearCredentials();
                };

            }])

    .controller('LoginModalCtrl',
        ['$scope', '$element', 'authentication', 'close',
            function($scope, $element, authentication, close) {

                $scope.login = function () {
                    $scope.dataLoading = true;
                    
                    authentication.Login($scope.username, $scope.password, function (response) {
                        if (response.success) {
                            authentication.SetCredentials($scope.username, response.apiKey, response.apiSecret);
                            $scope.error = null;
                            $scope.dataLoading = false;
                            
                            close(true, 500); // close modal, but give 500ms for bootstrap to animate
                            $element.modal('hide'); // dirty fix for backdrop not hiding issue
                        } else {
                            $scope.error = response.message;
                            $scope.dataLoading = false;
                        }
                    });
                }

            }]);