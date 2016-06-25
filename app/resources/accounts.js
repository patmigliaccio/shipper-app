angular.module('resources.accounts', [])

    .factory('accounts',
        ['$resource', function($resource) {
            var root = 'accounts';

            return $resource(root, {},
                {
                    getTags: {
                        url: root + '/listtags',
                        method: 'GET',
                        array: true
                    }
                });

    }]);