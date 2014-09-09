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

app.run(['$rootScope', '$httpBackend', 'Props', function ($rootScope, $httpBackend, Props){
    $rootScope.devFlag = true;

    var hakulomakkeet = [],
        hakukausiKoodit = [],
        hakutyyppiKoodit = [],
        organisaatiot = [],
        organisaatio = {},
        organisaationHakukohteet = {},
        teemat = [],
        lisakysymykset = [],
        hakulomakeName = {};

    //käyttäjän organisaatiot
    $.getJSON(Props.contextRoot + '/app/test-data/represented-organizations.json', function (data) {
            console.log('### mock data 4 organisaatio valinta ###');
            organisaatiot = data;
        }
    );
    $httpBackend.whenGET(/\/haku\-app\/application\-system\-form\-editor\/application\-system\-form\/([0-9]+\.)+[0-9]+\/represented\-organizations/).respond(
        function () {
            return [200, organisaatiot, {status: 200}];
        }
    );

    //hakulomakkeet
    $.getJSON(Props.contextRoot + '/app/test-data/application-system-form.json', function (data) {
            console.log('### mock data 4 hakulomakkeet ###');
            hakulomakkeet = data;
        }
    );
    $httpBackend.whenGET(Props.formEditorUri + '/application-system-form').respond(
        function () {
            return [200, hakulomakkeet, {status: 200}];
        }
    );

    //hakukausien koodit
    $.getJSON(Props.contextRoot + '/app/test-data/kausi-koodit.json', function (data) {
            console.log('### mock data 4 hakukausi koodit ###');
            hakukausiKoodit = data;
        }
    );
    $httpBackend.whenGET(/\/koodisto\-service\/rest\/json\/kausi\/koodi\?onlyValidKoodis\=true/).respond(
        function () {
            return [200, hakukausiKoodit, {status: 200}];
        }
    );

    //hakutyyppien koodit
    $.getJSON(Props.contextRoot + '/app/test-data/hakutyyppi-koodit.json', function (data) {
            console.log('### mock data 4 hakutyyppi koodit ###');
            hakutyyppiKoodit = data;
        }
    );
    $httpBackend.whenGET(/\/koodisto\-service\/rest\/json\/hakutyyppi\/koodi\?onlyValidKoodis\=true/).respond(
        function () {
            return [200, hakutyyppiKoodit, {status: 200}];
        }
    );

    //aalto korkeakoulu organisaatio
    $.getJSON(Props.contextRoot + '/app/test-data/aalto-korkeakoulusaatio.json', function (data) {
            console.log('### mock data 4 valittu organisaatio  ###');
            organisaatio = data;
        }
    );
    $httpBackend.whenGET(/\/organisaatio\-service\/rest\/organisaatio\/([0-9]+\.)+[0-9]+/).respond(
        function () {
            return [200, organisaatio, {status: 200}];
        }
    );

    //organisaation hakukohteet
    $.getJSON(Props.contextRoot + '/app/test-data/organisaation-hakukohteet.json', function (data) {
            console.log('### mock data 4 valittun organisaation hakukohteet  ###');
            organisaationHakukohteet = data;
        }
    );
//    $httpBackend.whenGET(/^https\:\/\/itest\-virkailija\.oph\.ware\.fi\/tarjonta\-service\/rest\/v1\/hakukohde\/search\?hakuOid\=([0-9]+\.)+[0-9]+\&organisationOid\=([0-9]+\.)+[0-9]+/).respond(
    $httpBackend.whenGET(/.*\:\/+([a-z0-9]+\-)+([a-z0-9]+\.)+[a-z]+\/tarjonta\-service\/rest\/v1\/hakukohde\/search\?hakuOid\=([0-9]+\.)+[0-9]+\&organisationOid\=([0-9]+\.)+[0-9]+/).respond(
        function () {
            return [200, organisaationHakukohteet, {status: 200}];
        }
    );

    //lisäkysmysten teemat
    $.getJSON(Props.contextRoot + '/app/test-data/additional-question-themes.json', function (data) {
            console.log('### mock data 4 lisäkysmysten teemat ###');
            teemat = data;
        }
    );
    $httpBackend.whenGET(/\/haku\-app\/application\-system\-form\-editor\/application\-system\-form\/([0-9]+\.)+[0-9]+\/additional\-question\-themes/).respond(
        function () {
            return [200, teemat, {status: 200}];
        }
    );

    //lisäkysymys lista
    $.getJSON(Props.contextRoot + '/app/test-data/hakukohde-additional-questions.json', function (data) {
            console.log('### mock data 4 lisäkysymykset lista ###');
            lisakysymykset = data;
        }
    );
    $httpBackend.whenGET(/\/haku\-app\/application\-system\-form\-editor\/theme\-question\/list\/([0-9]+\.)+[0-9]+\//).respond(
        function () {
            return [200, lisakysymykset, {status: 200}];
        }
    );

    //hakulomake nimi
    $.getJSON(Props.contextRoot + '/app/test-data/hakulomakkeen-name.json', function (data) {
            console.log('### mock data 4 hakulomakkeen nimi ###');
            hakulomakeName = data;
        }
    );
    $httpBackend.whenGET(/\/haku\-app\/application\-system\-form\-editor\/application\-system\-form\/([0-9]+\.)+[0-9]+\/name+/).respond(
        function () {
            return [200, hakulomakeName, {status: 200}];
        }
    );

    //lisäkysymys tyypit mock
  /*  $httpBackend.whenGET(Props.backEndRoot+'haku-app/lomakkeenhallinta/themequestion/types').respond(
        function( method, url){
            console.log('-- Lisäkysymys tyypit ', url);
            var lisakysymysTyypit = $.getJSON(Props.contextRoot+'/app/test-data/types.json', function(data){
                console.log('mock data json lisäkysmys tyypeille ');
                return data;
            });
            return [200, lisakysymysTyypit ,{status:200, message:' lisäkysymys tyypit'}];
        }
    );*/

    //kielet mock
    /*$httpBackend.whenGET(/\haku-app\/lomakkeenhallinta\/themequestion\/languages/).respond(
        function( method, url){
            console.log('******* Languages *****');
            var languages = $.getJSON(Props.contextRoot+'/app/test-data/languages.json', function(data){
                console.log('mock data json kielet');
                return data;
            });
            return [200, languages ,{status:200, message:'Haettiin kielet'}];
        }
    );*/

    //tarjonan api käyttö

    $httpBackend.whenGET(/lokalisointi\/cxf\/rest\/v1\/localisation\?category\=hakulomakkeenhallinta/).passThrough();
    $httpBackend.whenGET(/tarjonta-service\/rest\/v1\/hakukohde\//).passThrough();
    $httpBackend.whenGET(/cas\/myroles/).passThrough();
    $httpBackend.whenGET(/test-data\//).passThrough();
    $httpBackend.whenGET(/app\/test-data\/languages.json/).passThrough();
    $httpBackend.whenGET(/partials\//).passThrough();
}]);