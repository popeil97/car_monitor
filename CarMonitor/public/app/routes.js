var app = angular.module('appRoutes', ['ngRoute'])

// Configure Routes; 'authenticated = true' means the user must be logged in to access the route
.config(function($routeProvider, $locationProvider) {

    // AngularJS Route Handler
    $routeProvider

    // Route: Home             

    // Route: About Us (for testing purposes)
    // Route: User Registration

    .when('/', {
        templateUrl: 'app/views/welcome.html',
        authenticated: false
    })

    // Route: User Login
    .when('/login', {
        templateUrl: 'app/views/login.html',
        controller: 'loginCtrl',
        controllerAs: '$ctrl',
        authenticated: false
    })

    .when('/home/:username', {
        templateUrl: 'app/views/home.html',
        controller: 'homeCtrl',
        authenticated: false
    })

    .otherwise({ redirectTo: '/' }); // If user tries to access any other route, redirect to home page

    $locationProvider.html5Mode({ enabled: true, requireBase: false }); // Required to remove AngularJS hash from URL (no base is required in index file)
});