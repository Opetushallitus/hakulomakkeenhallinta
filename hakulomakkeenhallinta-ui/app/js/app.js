'use strict';

angular.module('hakulomakkeenhallinta', [
    'ngRoute',
    'ngResource',
    'ui.bootstrap',
    'hakulomakkeenhallinta.filters',
    'hakulomakkeenhallinta.services',
    'hakulomakkeenhallinta.directives',
    'hakulomakkeenhallinta.controllers',
    'jm.i18next'
])

.value('Config', {
    koodistoUrl: 'https://itest-virkailija.oph.ware.fi/koodisto-service/rest/json/'
})

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

.provider('Form', function() {
    this.$get = ['$resource',
        function($resource) {
            var Form = $resource('http://localhost:8080/hakulomakkeenhallinta-temporary/form/:_id', {}, {
                update: {
                    method: 'PUT'
                }
            });
            return Form;
        }
    ];
});
