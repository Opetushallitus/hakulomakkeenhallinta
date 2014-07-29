'use strict';

var app = angular.module('hakulomakkeenhallinta', [
        'ngRoute',
        'ngResource',
        'ui.bootstrap',
        'jm.i18next',
        'ngSanitize',
        'hakulomakkeenhallintaUiApp.filters',
        'hakulomakkeenhallintaUiApp.directives',
        'hakulomakkeenhallintaUiApp.services.provider',
        'hakulomakkeenhallintaUiApp.services.service',
        'hakulomakkeenhallintaUiApp.services.util',
        'hakulomakkeenhallintaUiApp.services.factory',
        'hakulomakkeenhallintaUiApp.controllers'
    ]);

    app.config(['$resourceProvider', function ($resourceProvider) {
        // Don't strip trailing slashes from calculated URLs
        $resourceProvider.stripTrailingSlashes = false;
    }]);

   app.config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.
            when('/applicationSystemForm', {
                templateUrl: 'partials/applicationSystemFormIndex.html'
            }).when('/applicationSystemForm/:id', {
                templateUrl: 'partials/applicationSystemForm.html',
                controller: 'ApplicationSystemFormCtrl'
            }).when('/applicationSystemForm/:id/:eid', {
                templateUrl: 'partials/elements/edit/Element.html',
                controller: 'ApplicationSystemFormCtrl'
            }).when('/applicationSystem', {
                templateUrl: 'partials/applicationSystem.html'
            }).when('/applicationSystems', {
                templateUrl: 'partials/applicationForms.html'
            }).when('/themeQuestionsByOrganisation/:id/:oid', {
                templateUrl: 'partials/themeQuestionsByOrganisation.html',
                controller: 'ThemeQuestionsByOrganisationCtrl'
            }).when('/themeQuestionsByOrganisation/:id/:oid/:hakuOid/:themeId/:qtype', {
                templateUrl: 'partials/lisakysymykset/kysymystekstit.html',
                controller: 'CreateAdditionalQuestionCtrl'
            }).when('/modifyThemeQuestion/:id/:oid/:questionId', {
                templateUrl: 'partials/lisakysymykset/kysymystekstit.html',
                controller: 'ModifyAdditionalQuestionCtrl'
            }).otherwise({
                redirectTo: '/applicationSystemForm'
            });
        }
    ]);

    app.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }]);

    app.config(['$i18nextProvider',
        function($i18nextProvider) {
            $i18nextProvider.options = {
                resGetPath: 'locales/__ns__-__lng__.json',
                lng: 'fi',
                ns: 'language',
                getAsync: false,
                sendMissing: false,
                fallbackLng: 'fi',
                debug: false
            };
        }
    ]);

    app.provider('_', function() {
        this.$get = [
            function() {
                return window._;
            }
        ];
    });

    app.run(['$rootScope', function($rootScope){
        $rootScope.devFlag = true;
    }]);