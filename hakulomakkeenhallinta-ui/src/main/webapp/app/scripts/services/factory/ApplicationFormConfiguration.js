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
                    changeFormConfigurationTemplate: {
                        method: 'POST',
                        url: Props.formConfigurationUri + '/:_asId/formTemplate',
                        params: { _asId: '@_asId'}
                    },
                    setFormConfiguration: {
                        method: 'POST',
                        url: Props.formConfigurationUri + '/:_asId/groupConfiguration/:_groupId',
                        params: { _asId: '@_asId', _groupId: '@_groupId'}
                    },
                    deleteFormConfiguration: {
                        method: 'POST',
                        url: Props.formConfigurationUri + '/:_asId/groupConfiguration/:_groupId/delete',
                        params: { _asId: '@_asId', _groupId: '@_groupId'}
                    }
                }
            );
            //headers: { 'Content-Type': 'application/json' },
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
                FormConfiguration.changeFormConfigurationTemplate({_asId: applicationSystemId}, formConf).$promise.then(
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
             * Asetetaan hakulomakkeen asetuksiin hakukohderyhmälle hakukohteiden
             * haku määrä rajoitteen
             * @param applicationSysmtemId hakulomakkeen id
             * @param hakukohdeRyhmaOid hakukohde ryhmän id
             * @param hakukohdeRajoite numero arvo valittavien hakukohteiden määrälle hakukohde ryhmässä
             * @returns {promise}
             */
            ApplicationFormConfiguration.asetaHakukohderyhmaRajoite = function (applicationSystemId, hakukohdeRyhmaOid, hakukohdeRajoite) {
                var deferred = $q.defer();
                $rootScope.LOGS('ApplicationFormConfiguration', 'asetaHakukohderyhmaRajoite()', applicationSystemId, hakukohdeRyhmaOid, hakukohdeRajoite);
                var groupConf =
                {
                    groupId: hakukohdeRyhmaOid,
                    type: 'hakukohde_rajaava',
                    configurations: {
                        maximumNumberOf: hakukohdeRajoite
                    }
                };
                FormConfiguration.setFormConfiguration({ _asId: applicationSystemId, _groupId: hakukohdeRyhmaOid }, groupConf).$promise.then(
                    function success(data) {
                        deferred.resolve(data);
                    },
                    function error(resp) {
                        deferred.reject(resp);
                    }
                );
                return deferred.promise;
            };
            ApplicationFormConfiguration.tallennaHakukohderyhmanOsoite = function (applicationSystemId, hakukohdeRyhmaOid, hakukohdeRyhmanOsoite) {
                var deferred = $q.defer();
                $rootScope.LOGS('ApplicationFormConfiguration', 'tallennaHakukohderyhmanOsoite()', applicationSystemId, hakukohdeRyhmaOid, hakukohdeRyhmanOsoite);
                var groupConf =
                {
                    groupId: hakukohdeRyhmaOid,
                    type: 'hakukohde_liiteosoite',
                    configurations: {
                        useFirstAoAddress: hakukohdeRyhmanOsoite.useFirstAoAddress,
                        addressRecipient: hakukohdeRyhmanOsoite.address.recipient,
                        addressStreet: hakukohdeRyhmanOsoite.address.street,
                        addressPostalCode: hakukohdeRyhmanOsoite.address.postCode,
                        addressPostOffice: hakukohdeRyhmanOsoite.address.postOffice,
                        deadline: hakukohdeRyhmanOsoite.deliveryDue,
                        helpText: hakukohdeRyhmanOsoite.helpText
                    }
                };
                FormConfiguration.setFormConfiguration({ _asId: applicationSystemId, _groupId: hakukohdeRyhmaOid }, groupConf).$promise.then(
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
                $http.get(Props.formConfigurationUri + '/' + applicationSystemId + '/defaultTemplate').success(
                    function (defaultTemplate) {
                        deferred.resolve(defaultTemplate);
                    }).error(function (resp) {
                        deferred.reject(resp);
                    }
                );
                return deferred.promise;
            };
            /**
             * Haetaan hakulomakkeen pohjan asetukset taustajärjestelmästä
             * @param applicationSystemId Haun oid, alias hakulomakkeen id
             * @returns {promise}
             */
            ApplicationFormConfiguration.haeLomakepohjanAsetukset = function (applicationSystemId) {
                var deferred = $q.defer();
                $rootScope.LOGS('ApplicationFormConfiguration', 'haeLomakepohjanAsetukset()', applicationSystemId);
                    FormConfiguration.get({'_id': applicationSystemId}).$promise.then(
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
             * Poistetaan hakukohderyhmä hakulomakkeen asetuksista
             * @param applicationSystemId Haun oid, alias hakulomakkeen id
             * @param rajoiteRyhma rajoite ryhmä objekti
             * @returns {promise}
             */
             ApplicationFormConfiguration.poistaHakukohderyhmaLomakkeenAsetuksista = function (applicationSystemId, rajoiteRyhma) {
                var deferred = $q.defer();
                $rootScope.LOGS('ApplicationFormConfiguration', 'poistaHakukohderyhmaLomakkeenAsetuksista()', applicationSystemId, rajoiteRyhma);
                 var groupConf =
                {
                    groupId: rajoiteRyhma.groupId,
                    type: rajoiteRyhma.type
                };
                FormConfiguration.deleteFormConfiguration({ _asId: applicationSystemId, _groupId: rajoiteRyhma.groupId }, groupConf).$promise.then(
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
             * lisätään uusi ryhma lomakepohjan asetuksiin
             * @param applicationSystemId hakulomakkeen id
             * @param hakukohdeRyhma lisättävä hakukohderyhmä
             * @returns {promise}
             */
            ApplicationFormConfiguration.lisaaRyhmaLomakepohjanAsetuksiin = function (applicationSystemId, hakukohdeRyhma) {
                var deferred = $q.defer();
                $rootScope.LOGS('ApplicationFormConfiguration', 'lisaaRyhmaLomakepohjanAsetuksiin()', applicationSystemId, hakukohdeRyhma);
                var groupConf =
                {
                    groupId: hakukohdeRyhma.groupId,
                    type: hakukohdeRyhma.type
                };
                FormConfiguration.setFormConfiguration({  _asId: applicationSystemId, _groupId: hakukohdeRyhma.groupId }, groupConf).$promise.then(
                    function success(data) {
                        deferred.resolve(data);
                    },
                    function error(resp) {
                        deferred.reject(resp);
                    }
                );
                return deferred.promise;
            };

            return ApplicationFormConfiguration;
        }]
    );
