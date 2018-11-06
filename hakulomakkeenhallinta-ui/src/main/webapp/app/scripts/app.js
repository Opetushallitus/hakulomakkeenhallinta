'use strict';

var app = angular.module('hakulomakkeenhallinta', [
    'ngRoute',
    'ngResource',
    'angular.filter',
    'angular-squire',
    'ui.bootstrap',
    'jm.i18next',
    'ngSanitize',
    'ngCookies',
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
    $resourceProvider.defaults.stripTrailingSlashes = false;
}]);

app.run(["$http","$cookies", function($http, $cookies) {
    $http.defaults.headers.common['clientSubSystemCode'] = "hakulomakkeenhallinta.hakulomakkeenhallinta-ui";
    $http.defaults.headers.common['Caller-Id'] = "hakulomakkeenhallinta.hakulomakkeenhallinta-ui";
    if($cookies['CSRF']) {
        $http.defaults.headers.common['CSRF'] = $cookies['CSRF']
    }
}])

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
            }).when('/applicationSystemFormConfigurations/:id/:oid', {
                templateUrl: 'partials/lomakepohjanAsetukset.html',
                controller: 'LomakepohjanAsetuksetCtrl'
            }).otherwise({
                redirectTo: '/applicationSystemForm'
            });
    }
]);

app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);

app.config(['squireServiceProvider', function(squireServiceProvider) {
    squireServiceProvider.strictPaste(true);
}]);

app.provider('_', function() {
    this.$get = [
        function() {
            return window._;
        }
    ];
});

app.run(['$rootScope', function($rootScope){
}]);