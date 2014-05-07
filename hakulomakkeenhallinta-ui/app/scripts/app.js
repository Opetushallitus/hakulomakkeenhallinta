'use strict';

angular.module('hakulomakkeenhallinta', [
        'ngRoute',
        'ngResource',
        'ui.bootstrap',
        'jm.i18next',
        'hakulomakkeenhallintaUiApp.filters',
        'hakulomakkeenhallintaUiApp.directives',
        'hakulomakkeenhallintaUiApp.services.provider',
        'hakulomakkeenhallintaUiApp.services.service',
        'hakulomakkeenhallintaUiApp.services.util',
        'hakulomakkeenhallintaUiApp.services.factory',
        'hakulomakkeenhallintaUiApp.controllers'
        ,'ngMockE2E'
    ])

    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/applicationSystemForm', {
                templateUrl: 'partials/applicationSystemFormIndex.html'
            });

            $routeProvider.when('/applicationSystemForm/:id', {
                templateUrl: 'partials/applicationSystemForm.html',
                controller: 'ApplicationSystemFormCtrl'
            });
            $routeProvider.when('/applicationSystemForm/:id/:eid', {
                templateUrl: 'partials/elements/edit/Element.html',
                controller: 'ApplicationSystemFormCtrl'
            });
            $routeProvider.when('/additionalQuestion/:id/:aoid', {
                templateUrl: 'partials/additionalQuestions.html',
                controller: 'AdditionalQuestionsCtrl'
            });
            $routeProvider.when('/applicationSystem', {
                templateUrl: 'partials/applicationSystem.html'
            });
            $routeProvider.when('/applicationSystems', {
                templateUrl: 'partials/applicationForms.html'
            });
            $routeProvider.when('/applicationSystems/:applicationFormId/:applicationOptionId', {
                templateUrl: 'partials/additionalQuestions.html',
                controller: 'AdditionalQuestionsCtrl'
            });
            $routeProvider.otherwise({
                redirectTo: '/applicationSystemForm'
            });
        }
    ])
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }])

    .config(['$i18nextProvider',
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
    ])
    .provider('_', function() {
        this.$get = [

            function() {
                return window._;
            }
            ];
    })

    .run(function($httpBackend, Props){
        console.log('**** $httpBackkend mock ****');

        //hakulomakkeiden mockki
        var hakuLomakkeet = [];
        $.getJSON(Props.envUrl+'/app/test-data/applicationSystems.json', function(data){
            console.log('mock data json hakulomakkeet ');
            hakuLomakkeet = data;
        });
        $httpBackend.whenGET(/\hakulomakkeenhallinta-temporary\/application-system-form/).respond(function(){ return [ 200, hakuLomakkeet]});

        //mallipohjien mockki
        var malliPohjat = [];
        $.getJSON(Props.envUrl+'/app/test-data/applicationFormTemplates.json', function(data){
            console.log('mock data json malli pohjat ');
            malliPohjat = data;
        });
        $httpBackend.whenGET(/\hakulomakkeenhallinta-temporary\/form/).respond(function(){ return [200, malliPohjat]});

        //tarjonan api käyttö
        $httpBackend.whenGET(/tarjonta-service\/rest\/v1\//).passThrough();

        $httpBackend.whenGET(/test-data\//).passThrough();
//        $httpBackend.whenGET(/\hakulomakkeenhallinta-temporary\/form/).passThrough();

        $httpBackend.whenGET(/app\/test-data\/languages.json/).passThrough();
        $httpBackend.whenGET(/app\/test-data\/languages.json/).passThrough();
        $httpBackend.whenGET(/\partials\//).passThrough();
        $httpBackend.whenGET(/\hakulomakkeenhallinta-temporary\/application-system-form/).passThrough();

    });

