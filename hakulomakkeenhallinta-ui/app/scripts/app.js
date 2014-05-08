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
        $httpBackend.whenGET(/\hakulomakkeenhallinta-temporary\/application-system-form/).respond(function(){
            return [ 200, hakuLomakkeet, {status:200, message:'haettiin hakulomakkeet'}];
            //mock virhe tapauksessa
//            return [ 404, {status:404, messages:'ei löydy hakulomakkeita'}];
        });

        //mallipohjien mockki
        var malliPohjat = [];
        $.getJSON(Props.envUrl+'/app/test-data/applicationFormTemplates.json', function(data){
            console.log('mock data json malli pohjat ');
            malliPohjat = data;
        });
        $httpBackend.whenGET(/\hakulomakkeenhallinta-temporary\/form/).respond(function(){
            return [200, malliPohjat, {status:200, message: 'saatiin mallipohjat' }];
            //mock virhe tapauksessa
//            return [404,  {status:404, message: 'ei löydy' }];
        });

        //hakulomakkeen poisto id:llä
        $httpBackend.whenDELETE(/\hakulomakkeenhallinta-temporary\/application-system-form\/(\d)/).respond(
            function(data, url){
                console.log('--- DELETE tämä ei vielä tee mitään ---', url);
                var id = url.substr(url.lastIndexOf('/')+1);
                console.log(id);
                if(id === '1.2.246.562.5.2013111213130760225065'){
                    return [400 , {status: 400, message: 'poisto ei onnistunut'}];
                }
                return [200 , {status: 200, message: 'hakulomakkeen poisto'}];
            });

        //mallipohjan poisto id:llä
        $httpBackend.whenDELETE(/\hakulomakkeenhallinta-temporary\/form\/(\d)/).respond(
            function(data, url){
                console.log('--- DELETE mallipohja tämä ei vielä tee mitään ---', url);
                var id = url.substr(url.lastIndexOf('/')+1);
                console.log(id);
                if(id === '1.2.246.562.5.2013111213130760225065'){
                    return [400 , {status: 400, message: 'mallipohjan poisto ei onnistunut'}];
                }
                return [200 , {status: 200, message: 'mallipohjan poisto'}];
            });

        //tarjonan api käyttö
        $httpBackend.whenGET(/tarjonta-service\/rest\/v1\//).passThrough();

        $httpBackend.whenGET(/test-data\//).passThrough();
//        $httpBackend.whenGET(/\hakulomakkeenhallinta-temporary\/form/).passThrough();

        $httpBackend.whenGET(/app\/test-data\/languages.json/).passThrough();
        $httpBackend.whenGET(/app\/test-data\/languages.json/).passThrough();
        $httpBackend.whenGET(/\partials\//).passThrough();
        $httpBackend.whenGET(/\hakulomakkeenhallinta-temporary\/application-system-form/).passThrough();

    });

