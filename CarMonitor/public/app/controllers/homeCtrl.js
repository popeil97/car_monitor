angular.module('homeController', ['userServices'])

.controller('homeCtrl', function($scope, $routeParams, User) {
    console.log('we in here');
    $scope.user = {};
    $scope.openWorkflows = [];
    console.log($routeParams.username);
    
    $scope.init = function() {

        User.getUser($routeParams.username).then(function(res) {
            // $scope.user = res.user;
            console.log(res);
            $scope.user = res.data.user;
        })

        .then(function() {
            $scope.$broadcast('user-received', {user: $scope.user});
        })

    }

    $scope.init();
});