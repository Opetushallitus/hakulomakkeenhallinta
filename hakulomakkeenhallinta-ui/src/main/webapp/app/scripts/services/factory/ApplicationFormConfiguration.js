'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.factory')
    .factory('ApplicationFormConfiguration', ['$rootScope', '$resource', 'Props', '$q', '_', '$timeout', '$http',
        function ($rootScope, $resource, Props, $q, _, $timeout, $http) {
            var ApplicationFormConfiguration = {};

            var formConfigurationUri = window.url("haku-app.formConfiguration");
            var FormConfiguration = $resource(formConfigurationUri + '/:_id',
                {_id: '@_id'},
                {
                    getFormTemplates: {
                        method: 'GET',
                        isArray: true,
                        url: formConfigurationUri + '/templates'
                    },
                    changeFormConfigurationTemplate: {
                        method: 'POST',
                        url: formConfigurationUri + '/:_asId/formTemplate',
                        params: { _asId: '@_asId'}
                    },
                    setFormConfiguration: {
                        method: 'POST',
                        url: formConfigurationUri + '/:_asId/groupConfiguration/:_groupId',
                        params: { _asId: '@_asId', _groupId: '@_groupId'}
                    },
                    deleteFormConfiguration: {
                        method: 'POST',
                        url: formConfigurationUri + '/:_asId/groupConfiguration/:_groupId/delete',
                        params: { _asId: '@_asId', _groupId: '@_groupId'}
                    }
                }
            );
            //headers: { 'Content-Type': 'application/json' },
            ApplicationFormConfiguration.vaihdaHaunLomakepohja = function (haku, lomakepohjaId) {
                $rootScope.LOGS('ApplicationFormConfiguration', 'vaihdaHaunLomakepohja()', haku.oid, lomakepohjaId);
                if (haku.ataruLomake) {
                    return $q.reject({
                        status: 400,
                        statusText: "Yritettiin vaihtaa lomakepohjaa Hakemuspalvelun lomaketta käyttävässä haussa"
                    });
                }
                var formConf = {
                    applicationSystemId: haku.oid,
                    formTemplateType: lomakepohjaId
                };
                return FormConfiguration.changeFormConfigurationTemplate({_asId: haku.oid}, formConf).$promise
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
            ApplicationFormConfiguration.tallennaHakukohderyhmanOsoite = function (haku, hakukohdeRyhmaOid, hakukohdeRyhmanOsoite) {
                $rootScope.LOGS('ApplicationFormConfiguration', 'tallennaHakukohderyhmanOsoite()', haku.oid, hakukohdeRyhmaOid, hakukohdeRyhmanOsoite);
                if (haku.ataruLomake) {
                    return $q.reject({
                        status: 400,
                        statusText: "Yritettiin asettaa osoite Hakemuspalvelun lomaketta käyttävässä haussa"
                    });
                }
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
                return FormConfiguration.setFormConfiguration({ _asId: haku.oid, _groupId: hakukohdeRyhmaOid }, groupConf).$promise;
            };
            /**
             * Palauttaa taustajärjestelmästä hakulomake pohjat
             * @returns {promise}
             */
            ApplicationFormConfiguration.haeLomakepohjat = function (haku) {
                $rootScope.LOGS('ApplicationFormConfiguration', 'haeLomakepohjat()');
                if (haku.ataruLomake) {
                    return $q.when([{
                        id: "ATARU",
                        name: {
                            translations: {
                                fi: "Hakemuspalvelun lomake",
                                sv: "SV: Hakemuspalvelun lomake",
                                en: "EN: Hakemuspalvelun lomake"
                            }
                        }
                    }]);
                } else {
                    return FormConfiguration.getFormTemplates().$promise;
                }
            };
            ApplicationFormConfiguration.haeDefaultLomakepohja = function (haku) {
                $rootScope.LOGS('ApplicationFormConfiguration', 'haeDefaultLomakepohja()');
                if (haku.ataruLomake) {
                    return $q.when("ATARU");
                } else {
                    return $http.get(formConfigurationUri + '/' + haku.oid + '/defaultTemplate');
                }
            };

            ApplicationFormConfiguration.haeLomakepohjanAsetukset = function (haku) {
                $rootScope.LOGS('ApplicationFormConfiguration', 'haeLomakepohjanAsetukset()', haku.oid);
                if (haku.ataruLomake) {
                    return $q.resolve({
                        formTemplateType: "ATARU",
                        groupConfigurations: []
                    });
                } else {
                    return FormConfiguration.get({'_id': haku.oid}).$promise;
                }
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
