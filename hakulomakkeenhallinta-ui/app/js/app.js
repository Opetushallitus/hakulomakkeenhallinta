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
    koodistoUrl: 'https://itest-virkailija.oph.ware.fi/koodisto-service/rest/json/',
    tarjontaUrl: 'https://itest-virkailija.oph.ware.fi/tarjonta-service/rest/v1/',
    asfUrl: 'http://localhost:8080/hakulomakkeenhallinta-temporary/application-system-form/:_id'
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


.provider('ASFResource', function() {
    this.$get = ['$resource', 'Config',
        function($resource, Config) {
            var Form = $resource(Config.asfUrl, {}, {
                update: {
                    method: 'PUT'
                }
            });
            return Form;
        }
    ];
})
    .provider('TypeResource', function() {
        this.$get = ['$resource',
            function($resource) {
                return $resource('http://localhost:8080/hakulomakkeenhallinta-temporary/type/:id', {}, {});
            }
        ];
    })
    .provider('ApplicationSystemResource', function() {
        this.$get = ['$resource', 'Config', '_',
            function($resource, Config , _) {
                return $resource(Config.tarjontaUrl + 'haku/findAll', {}, {
                    query: {
                        method: 'GET',
                        isArray: true,
                        transformResponse: function(data, headers) {
                            return _.chain(angular.fromJson(data).result)
                                .filter(function(as) {
                                    return as.tila === "JULKAISTU";
                                })
                                .map(function(as) {
                                    return {
                                        _id : as.id,
                                        applicationPeriods : [
                                            {end : '2013-04-03T10:11:53.547Z', start : '1914-04-03T11:32:01.547Z'}
                                        ],
                                        name : {
                                            translations : {
                                                fi : as.nimi.kieli_fi,
                                                sv : as.nimi.kieli_sv,
                                                en : as.nimi.kieli_en
                                            }
                                        },
                                        modified : 3382987597202887,
                                        _class : 'fi.vm.sade.haku.oppija.lomake.domain.ApplicationSystem',
                                        hakukausiUri: 'kausi_s',
                                        hakukausiVuosi: 2014,
                                        applicationSystemType : 'hakutyyppi_03'
                                    };
                                }).value();
                        }
                    }
                });
            }
        ];
    })


.provider('FormResource', function() {
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
