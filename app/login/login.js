angular.module('login', ['services.authentication', 'angularModalService'])

    .controller('LoginCtrl',
        ['$scope', '$rootScope', '$state', 'authentication', 'ModalService',
            function ($scope, $rootScope, $state, authentication, ModalService) {
                if($rootScope.globals.authData){
                    $scope.loggedIn = true;
                }
                
                $scope.showLogin = function (){
                    ModalService.showModal({
                        templateUrl: "app/login/login-modal.tpl.html",
                        controller: "LoginModalCtrl"
                    }).then(function(modal) {

                        modal.element.modal();
                        modal.close.then(function(result) {

                            if (result){
                                $scope.loggedIn = true;
                                $state.go('orders');
                            }
                        });

                    });
                };
                
                $scope.logout = function () {
                    $scope.loggedIn = false;
                    authentication.ClearCredentials();
                    $state.go('home');
                };

            }])

    .controller('LoginModalCtrl',
        ['$scope', '$element', 'authentication', 'close',
            function($scope, $element, authentication, close) {

                $scope.login = function () {
                    $scope.dataLoading = true;
                    
                    authentication.Login($scope.username, $scope.password, function (response) {
                        $scope.dataLoading = false;
                        
                        if (response.success) {
                            authentication.SetCredentials($scope.username, response.data.apiKey, response.data.apiSecret);
                            $scope.error = null;
                            
                            close(true, 500); // close modal, but give 500ms for bootstrap to animate
                            $element.modal('hide'); // dirty fix for backdrop not hiding issue
                        } else {
                            $scope.error = response.message;
                        }
                    });
                }

            }]);