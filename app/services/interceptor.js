var serialize = require('./serialize');

angular.module('services.interceptor', [])
    
    .factory('interceptor', ['$q', '$rootScope', function($q, $rootScope){
        
        var handlerError = function(rejection){
            //redirects to login if unauthorized
            if (rejection.status === 401){
                $rootScope.$broadcast('unauthorized');
            }

            return $q.reject(rejection);
        };

        return {
            //uses proxy for http requests
            request: function (config) {
                if (!config.url.match(/(.html|.php|.json)/)){  //ignores certain requests

                    //serializes parameters for proxy
                    var queryString = '';
                    if (typeof config.params !== "undefined"){
                        queryString = '?' + serialize(config.params);
                        delete config.params;
                    }

                    config.url = 'proxy.php?url=https://ssapi.shipstation.com/' + config.url + queryString + '&mode=native';
                }

                return config || $q.when(config);
            },
            response: function (response) {

                //handles  unauthorized proxy requests
                if (response.data == "401 Unauthorized"){
                    response.status = 401;
                    response.statusText = "Unauthorized";
                    return handlerError(response);
                }

                return response || $q.when(response);
            },
            responseError: handlerError
        };

    }]);
