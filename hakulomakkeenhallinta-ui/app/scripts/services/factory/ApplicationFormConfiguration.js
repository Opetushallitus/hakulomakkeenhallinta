'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.factory')
    .factory('ApplicationFormConfiguration', ['$rootScope', '$resource', 'Props', '$q', '_', '$timeout', '$http',
        function ($rootScope, $resource, Props, $q, _, $timeout, $http) {
            var ApplicationFormConfiguration = {};

            var FormConfiguration = $resource(Props.formConfigurationUri + '/:_id',
                {_id: '@_id'},
                {
                    getFormTemplates: {
                        method: 'GET',
                        isArray: true,
                        url: Props.formConfigurationUri + '/templates'
                    },
                    createApplicationSystemForm: {
                        method: 'POST',
                        isArray: false,
                        url: Props.formConfigurationUri + '/:_asId',
                        params: { _asId: '@_asId'}
                    },
                    updateApplicationSystemForm: {
                        method: 'POST',
                        isArray: false,
                        url: Props.formConfigurationUri + '/:_asId',
                        params: { _asId: '@_asId'}
                    }
                }
            );

            /**
             * Liitää haun valittuun lomakepohjaan
             * @param haunOid haun id
             * @param lomakepohjaOid lomakepohjan id
             * @returns {promise}
             */
            ApplicationFormConfiguration.tallennaLiitahakuLomakepohjaan = function (haunOid, lomakepohjaOid) {
                var deferred = $q.defer();
                $rootScope.LOGS('ApplicationFormConfiguration', 'tallennaLiitahakuLomakepohjaan()', haunOid, lomakepohjaOid);
                var formConf = {
                    applicationSystemId: haunOid,
                    formTemplateType: lomakepohjaOid
                };
                FormConfiguration.createApplicationSystemForm({_asId: haunOid}, formConf).$promise.then(
                    function success(data) {
                        deferred.resolve(data);
                    },
                    function error(resp) {
                        deferred.reject(resp);
                    }
                );
                return deferred.promise;
            };
            /**
             * Vaihtaa haun lomakepohjan
             * @param applicationSysmtemId hakulomakkeen id
             * @param lomakepohjaOid lomakepohjan id
             * @returns {promise}
             */
            ApplicationFormConfiguration.vaihdaHaunLomakepohja = function (applicationSystemId, lomakepohjaId) {
                var deferred = $q.defer();
                $rootScope.LOGS('ApplicationFormConfiguration', 'vaihdaHaunLomakepohja()',applicationSystemId, lomakepohjaId);

                var formConf = {
                    applicationSystemId: applicationSystemId,
                    formTemplateType: lomakepohjaId
                };
                FormConfiguration.updateApplicationSystemForm({_asId: applicationSystemId}, formConf).$promise.then(
                    function success(data) {
                        deferred.resolve(data);
                    },
                    function error(resp) {
                        deferred.reject(resp);
                    }
                );
                return deferred.promise;
            };
            /**
             * Tallentaa hakulomakkeen asetuksiin hakukohderyhmälle hakukohteiden
             * haku määrä rajoiteen
             * @param applicationSysmtemId hakulomakkeen id
             * @param hakukohdeRyhmaOid hakukohde ryhmän id
             * @param hakukohdeRajoite numero arvo valittavien hakukohteiden määrälle hakukohde ryhmässä
             * @returns {promise}
             */
            ApplicationFormConfiguration.tallennaHakukohderyhmaRajoite = function (applicationSystemId, hakukohdeRyhmaOid, hakukohdeRajoite) {
                var deferred = $q.defer();
                $rootScope.LOGS('ApplicationFormConfiguration', 'TODO: tällä', 'tallennaHakukohderyhmaRajoite()',applicationSystemId, hakukohdeRyhmaOid, hakukohdeRajoite);
                //TODO: tälle backend post kun se on saatavilla
                $timeout(function () {
                    deferred.resolve({status: 200, message: 'tallennus ok'});
//                    deferred.reject({status:400, message: 'tallennus ei onnistu'});
                }, 500);
                return deferred.promise;
            };
            /**
             * Palauttaa taustajärjestelmästä hakulomake pohjat
             * @returns {promise}
             */
            ApplicationFormConfiguration.haeLomakepohjat = function () {
                var deferred = $q.defer();
                $rootScope.LOGS('ApplicationFormConfiguration', 'haeLomakepohjat()');
                FormConfiguration.getFormTemplates().$promise.then(
                    function (formTemplates) {
                        deferred.resolve(formTemplates);
                    }
                );
                return deferred.promise;
            };
            /**
             * Palauttaa taustajärjestelmästä hakuun liittyvän
             * oletus hakulomakepohjan
             * @params applicationSystemId haun id
             * @returns {promise}
             */
            ApplicationFormConfiguration.haeDefaultLomakepohja = function (applicationSystemId) {
                var deferred = $q.defer();
                $rootScope.LOGS('ApplicationFormConfiguration', 'haeDefaultLomakepohja()');
                $http.get(Props.formConfigurationUri + '/' + applicationSystemId + '/default').success(
                    function (defaultTemplate) {
                        deferred.resolve(defaultTemplate);
                    }).error(function (resp) {
                        deferred.reject(resp);
                    }
                );
                return deferred.promise;
            };

            var lomakePohjanAsetukset = [
                {
                    groupId: '1.2.246.562.28.11347982643',
                    type: 'restriction',
                    configuration: {
                        maxSelection: 4
                    }
                },
                {
                    groupId: '1.2.246.562.28.28738790866',
                    type: 'restriction',
                    configuration: {
                        maxSelection: 11
                    }
                },
                {
                    groupId: '1.2.246.562.28.86934808281',
                    type: 'restriction',
                    configuration: {
                        maxSelection: 5
                    }
                },
                {
                    groupId: '1.2.246.562.28.11347982643',
                    type: 'priority',
                    configuration: {}
                },
                {
                    groupId: '1.2.246.562.28.11347982643',
                    type: 'exclusion',
                    configuration: {}
                },
            ];

            ApplicationFormConfiguration.haeLomakepohjanAsetukset = function (applicationSystemId) {
                var deferred = $q.defer();
                $rootScope.LOGS('ApplicationFormConfiguration', 'haeLomakepohjanAsetukset()', applicationSystemId);
                    FormConfiguration.get({'_id': applicationSystemId}).$promise.then(
                        function success(data) {
                            data.groupConfigurations = lomakePohjanAsetukset;
                            console.log('*** ', data);
                            deferred.resolve(data);
                        },
                        function error(resp) {
                            console.log('*** error:', resp);
                            deferred.reject(resp);
                        }
                    );
                return deferred.promise;
            };

             ApplicationFormConfiguration.poistaHakukohderyhmaRajoite = function (applicationSystemId, hakukohdeRajoite) {
                var deferred = $q.defer();
                $rootScope.LOGS('ApplicationFormConfiguration', 'TODO: tällä', 'poistaHakukohderyhmaRajoite()',applicationSystemId, hakukohdeRajoite);
                //TODO: tälle backend post kun se on saatavilla
                $timeout(function () {
                    deferred.resolve({status: 200, message: 'Poisto ok'});
                    //deferred.reject({status:400, message: 'poisto ei onnistu'});
                }, 500);
                return deferred.promise;
            };

            return ApplicationFormConfiguration;
        }]
    );
