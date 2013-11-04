'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
    'ngRoute',
    'ngResource',
    'ui.bootstrap',
    'myApp.filters',
    'myApp.services',
    'myApp.directives',
    'myApp.controllers'

    ]).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/hakulomakkeet', {templateUrl: 'partials/applicationForms.html'});
        $routeProvider.when('/hakulomakkeet/:applicationFormId/:applicationOptionId', {templateUrl: 'partials/additionalQuestions.html', controller: 'AdditionalQuestionsCtrl'});
        $routeProvider.otherwise({redirectTo: '/hakulomakkeet'});
    }]);
