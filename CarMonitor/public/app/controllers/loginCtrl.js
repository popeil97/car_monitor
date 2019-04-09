angular.module('loginController', ['userServices'])

.controller('loginCtrl', function($scope, $location, User) {
    
    $scope.loginTabClass = "active";
    $scope.registerTabClass = "";

    $scope.isLogin = true;

    $scope.submitCredentials = function(user) {

        if($scope.isLogin) {
            User.checkCredentials(user).then(function(res) {
                console.log(res);
                user.successMsg = res.data.success;
                user.errorMsg = res.data.error;
            })
            .then(function() {
                if(!user.errorMsg) {
                    var path = '/home/' + user.username;
                    $location.path(path);
                }
            });
        }

        else {
            User.create(user).then(function(res) {
                console.log(res);
                user.successMsg = res.data.success;
                user.errorMsg = res.data.error;
            })
            .then(function() {
                if(!user.errorMsg) {
                    var path = '/home/' + user.username;
                    $location.path(path);
                }
            });
        }

    }

    $scope.toggleView = function(view) {

        if(view == 1) {
            $scope.loginTabClass = "active";
            $scope.registerTabClass = "";
            $scope.isLogin = true;
        }

        else {
            $scope.loginTabClass = "";
            $scope.registerTabClass = "active";
            $scope.isLogin = false;
        }

    }



});