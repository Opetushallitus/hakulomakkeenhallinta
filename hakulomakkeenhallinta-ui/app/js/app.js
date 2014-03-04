'use strict';

// Declare app level module which depends on filters, and services
angular.module('hakulomakkeenhallinta', [
        'ngRoute',
        'ngResource',
        'ui.bootstrap',
        'hakulomakkeenhallinta.filters',
        'hakulomakkeenhallinta.services',
        'hakulomakkeenhallinta.directives',
        'hakulomakkeenhallinta.controllers',
        'jm.i18next'

    ]).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/form', {templateUrl: 'partials/form.html'});
        $routeProvider.when('/hakulomakkeet', {templateUrl: 'partials/applicationForms.html'});
        $routeProvider.when('/hakulomakkeet/:applicationFormId/:applicationOptionId', {templateUrl: 'partials/additionalQuestions.html', controller: 'AdditionalQuestionsCtrl'});
        $routeProvider.otherwise({redirectTo: '/hakulomakkeet'});
    }]).
    config(['$i18nextProvider', function ($i18nextProvider) {
        $i18nextProvider.options = {
            resGetPath: 'locales/__ns__-__lng__.json',
            lng: 'fi',
            ns: 'language',
            getAsync: false,
            sendMissing: false,
            fallbackLng: 'fi',
            debug: false
        };
    }]);