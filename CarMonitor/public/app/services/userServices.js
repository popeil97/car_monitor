angular.module('userServices', [])

.factory('User', function($http) {
    var userFactory = {};

    userFactory.create = function(regData) {
        return $http.post('/api/users', regData);
    };

    userFactory.checkCredentials = function(loginData) {
        return $http.post('/api/login', loginData);
    }

    userFactory.getUser = function(username) {
        let payload = {
            username : username
        };
        return $http.post('/api/getUser', payload);
    }

    return userFactory;
});