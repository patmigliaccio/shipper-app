angular.module('services.interceptor', [])
    
    .factory('interceptor', ['$q', '$rootScope', function($q, $rootScope){
        var handlerError = function(rejection){
            if (rejection.status === 401){
                $rootScope.$broadcast('unauthorized');
            }

            return $q.reject(rejection);
        };

        return {
            //uses proxy for http requests
            request: function (config) {
                if (!~config.url.indexOf('.html') && !~config.url.indexOf('data/')){  //ignores ngRoute requests and static data files

                    //serializes parameters for proxy
                    var queryString = '';
                    if (typeof config.params !== "undefined"){
                        queryString = '?' + serialize(config.params);
                        delete config.params;
                    }

                    config.url = 'proxy.php?url=' + config.url + queryString + '&mode=native';
                }

                return config || $q.when(config);
            },
            //handles  unauthorized proxy requests
            response: function (response) {

                if (response.data == "401 Unauthorized"){
                    response.status = 401;
                    response.statusText = "Unauthorized";
                    return handlerError(response);
                }

                return response || $q.when(response);
            },
            //redirects to login if unauthorized
            responseError: handlerError
        };

    }]);
