'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
        'ngRoute',
        'ui.bootstrap',
        'myApp.filters',
        'myApp.services',
        'myApp.directives',
        'myApp.controllers'

    ]).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/hakulomakkeet', {templateUrl: 'partials/hakulomakkeet.html', controller: 'HakulomakkeetCtrl'});
        $routeProvider.when('/mallipohjat', {templateUrl: 'partials/mallipohjat.html', controller: 'MallipohjatCtrl'});
        $routeProvider.otherwise({redirectTo: '/hakulomakkeet'});
    }]);
