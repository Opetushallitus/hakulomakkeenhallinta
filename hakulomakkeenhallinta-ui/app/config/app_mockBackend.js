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
    'hakulomakkeenhallintaUiApp.controllers',
    'ngMockE2E'
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
            }).when('/themeQuestionsByOrganisation/:id/:oid', {
                templateUrl: 'partials/lisakysymykset/themeQuestionsByOrganisation.html',
                controller: 'ThemeQuestionsByOrganisationCtrl'
            }).when('/themeQuestionsByOrganisation/:id/:oid/:hakuOid/:themeId/:qtype', {
                templateUrl: 'partials/lisakysymykset/kysymysLomake.html',
                controller: 'CreateAdditionalQuestionCtrl'
            }).when('/modifyThemeQuestion/:id/:oid/:questionId', {
                templateUrl: 'partials/lisakysymykset/kysymysLomake.html',
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

app.provider('_', function() {
    this.$get = [
        function() {
            return window._;
        }
    ];
});

app.run(['$rootScope', '$httpBackend', 'Props', '$q', function($rootScope, $httpBackend, Props, $q){
    $rootScope.devFlag = true;

    var hakulomakkeet;

    $.getJSON(Props.contextRoot + '/app/test-data/application-system-form.json', function (data) {
            console.log('mock data hakulomakkeet ', data);
            hakulomakkeet = data;
//                        return data;

//                    return data;
//            deferred.resolve(data);
        }
    );

    $httpBackend.whenGET(/\haku-app\/application-system-form-editor\/application-system-form/).respond(
        function (method, url) {
            console.log('***', method, url);
//            var deferred = $q.defer();
            return [200, hakulomakkeet ,{status:200, message:' hakulomakkeet'}];
//            return deferred.promise;
        }
    );


    //hakulomake lista mock data
    /*$.getJSON(Props.contextRoot+'/app/test-data/application-system-forms.json', function(data){
     console.log('mock data json hakulomakkeet ');
     return data;
     });*/

    //lisäkysymys tyypit mock
    $httpBackend.whenGET(Props.backEndRoot+'haku-app/lomakkeenhallinta/themequestion/types').respond(
        function( method, url){
            console.log('-- Lisäkysymys tyypit ', url);
            var lisakysymysTyypit = $.getJSON(Props.contextRoot+'/app/test-data/types.json', function(data){
                console.log('mock data json lisäkysmys tyypeille ');
                return data;
            });
            return [200, lisakysymysTyypit ,{status:200, message:' lisäkysymys tyypit'}];
        }
    );

    //kielet mock
    $httpBackend.whenGET(/\haku-app\/lomakkeenhallinta\/themequestion\/languages/).respond(
        function( method, url){
            console.log('******* Languages *****');
            var languages = $.getJSON(Props.contextRoot+'/app/test-data/languages.json', function(data){
                console.log('mock data json kielet');
                return data;
            });
            return [200, languages ,{status:200, message:'Haettiin kielet'}];
        }
    );

    //tarjonan api käyttö
    $httpBackend.whenGET(/tarjonta-service\/rest\/v1\//).passThrough();
    $httpBackend.whenGET(/cas\/myroles/).passThrough();
    $httpBackend.whenGET(/test-data\//).passThrough();
    $httpBackend.whenGET(/app\/test-data\/languages.json/).passThrough();
    $httpBackend.whenGET(/partials\//).passThrough();
}]);