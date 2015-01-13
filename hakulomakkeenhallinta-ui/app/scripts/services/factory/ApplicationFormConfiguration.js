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
                    },
                    createGroupConfigurationRestriction: {
                        method: 'POST',
                        isArray: false,
                        url: Props.formConfigurationUri + '/:_asId',
                        params: { _asId: '@_asId'}
                    },
                    removeGroupConfigurationRestriction: {
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
             * @param lomakepohjaId lomakepohjan id
             * @returns {promise}
             */
            ApplicationFormConfiguration.tallennaLiitahakuLomakepohjaan = function (haunOid, lomakepohjaId) {
                var deferred = $q.defer();
                $rootScope.LOGS('ApplicationFormConfiguration', 'tallennaLiitahakuLomakepohjaan()', haunOid, lomakepohjaOid);
                var formConf = {
                    applicationSystemId: haunOid,
                    formTemplateType: lomakepohjaId
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
             * Asetetaan hakulomakkeen asetuksiin hakukohderyhmälle hakukohteiden
             * haku määrä rajoitteen
             * @param applicationSysmtemId hakulomakkeen id
             * @param hakukohdeRyhmaOid hakukohde ryhmän id
             * @param hakukohdeRajoite numero arvo valittavien hakukohteiden määrälle hakukohde ryhmässä
             * @param lomakepohja {} lomakepohjan tiedot
             * @returns {promise}
             */
            ApplicationFormConfiguration.asetaHakukohderyhmaRajoite = function (applicationSystemId, hakukohdeRyhmaOid, hakukohdeRajoite, lomakepohja) {
                var deferred = $q.defer();
                $rootScope.LOGS('ApplicationFormConfiguration', 'asetaHakukohderyhmaRajoite()', applicationSystemId, hakukohdeRyhmaOid, hakukohdeRajoite);
                console.log(lomakepohja)
                //TODO: tallenna hakukohderyhmään hakukohde rajoite, kun backend tukee tätä
                var groupConf =
                {
                    applicationSystemId: applicationSystemId,
                    formTemplateType: lomakepohja.id,
                    groupConfigurations: [
                        {
                            groupdId: hakukohdeRyhmaOid,
                            type: 'MAXIMUM_NUMBER_OF',
                            configurations: {
                                maximumNumberOf: hakukohdeRajoite
                            }
                        }
                    ]
                };
                //TODO: poista tämä kun backend toimii oikein
                $timeout(function () {
                    deferred.resolve({status: 200, message: 'asetaHakukohderyhmaRajoite OK'});
                    //deferred.reject({status:400, message: 'Ryhmän lisääminen lomakepohjan asetuksiin ei onnistu'});
                }, 500);
                /*FormConfiguration.createGroupConfigurationRestriction({  _asId: applicationSystemId }, groupConf).$promise.then(
                    function success(data) {
                        console.log('^^^^ ', data);
                        deferred.resolve(data);
                    },
                    function error(resp) {
                        console.log('## ', resp);
                        deferred.reject(resp);
                    }
                );*/
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
            //TODO: poista tämä, kun ei enään tarvetta
            var lomakePohjanAsetukset = [
                {
                    groupId: '1.2.246.562.28.11347982643',
                    type: 'MAXIMUM_NUMBER_OF',
                    configuration: {
                        maxSelection: 4
                    }
                },
                {
                    groupId: '1.2.246.562.28.28738790866',
                    type: 'MAXIMUM_NUMBER_OF',
                    configuration: {
                        maxSelection: 11
                    }
                },
                {
                    groupId: '1.2.246.562.28.86934808281',
                    type: 'MAXIMUM_NUMBER_OF',
                    configuration: {
                        maxSelection: 5
                    }
                },
                {
                    groupId: '1.2.246.562.28.11347982643',
                    type: 'PRIORITY',
                    configuration: {}
                },
                {
                    groupId: '1.2.246.562.28.11347982643',
                    type: 'CONSTRAINT_GROUP',
                    configuration: {}
                },
            ];
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
             * @param lomakePohja lomake pohja objecti
             * @returns {promise}
             */
             ApplicationFormConfiguration.poistaHakukohderyhmaLomakkeenAsetuksista = function (applicationSystemId, rajoiteRyhma, lomakePohja) {
                var deferred = $q.defer();
                $rootScope.LOGS('ApplicationFormConfiguration', 'TODO: tällä', 'poistaHakukohderyhmaLomakkeenAsetuksista()',applicationSystemId, rajoiteRyhma, lomakePohja);
                 //TODO: tämän loppuun saatto kun back end tukee toimintoa
                 var groupConf =
                {
                    applicationSystemId: applicationSystemId,
                    formTemplateType: lomakePohja.id,
                    groupConfigurations: [
                        {
                            groupdId: rajoiteRyhma.groupdId,
                            type: rajoiteRyhma.type,
                            configurations: {
                                maximumNumberOf: 5
                            }
                        }
                    ]
                };
                //FormConfiguration.delete({ asId: applicationSystemId }, groupConf).$promise.then(
                /*FormConfiguration.removeGroupConfigurationRestriction({ asId: applicationSystemId }, groupConf).$promise.then(
                    function success(data) {
                        console.log('^^^^ ', data);
                        deferred.resolve(data);
                    },
                    function error(resp) {
                        console.log('## ', resp);
                        deferred.reject(resp);
                    }
                );*/
                //TODO: tälle backend post kun se on saatavilla
                $timeout(function () {
                    deferred.resolve({status: 200, message: 'Poisto ok'});
                    //deferred.reject({status:400, message: 'poisto ei onnistu'});
                }, 500);
                return deferred.promise;
            };
            /**
             * lisätään uusi ryhma lomakepohjan asetuksiin
             * @param applicationSystemId hakulomakkeen id
             * @param hakukohdeRyhma lisättävä hakukohderyhmä
             * @param lomakePohja lomakepohjan tiedot
             * @returns {promise}
             */
            ApplicationFormConfiguration.lisaaRyhmaLomakepohjanAstuksiin = function (applicationSystemId, hakukohdeRyhma, lomakePohja) {
                var deferred = $q.defer();
                $rootScope.LOGS('ApplicationFormConfiguration', 'TODO: tällä', 'lisaaRyhmaLomakepohjanAstuksiin()',applicationSystemId, hakukohdeRyhma, lomakePohja);
                var groupConf =
                {
                    applicationSystemId: applicationSystemId,
                    formTemplateType: lomakePohja.id,
                    groupConfigurations: [
                        {
                            groupdId: hakukohdeRyhma.groupdId,
                            type: hakukohdeRyhma.type,
                        }
                    ]
                };
                console.log('### ', groupConf);
                //TODO: tälle backend post kun se on saatavilla
                $timeout(function () {
                    deferred.resolve({status: 200, message: 'Ryhmän lisääminen lomakepohjan asetuksiin OK'});
                    //deferred.reject({status:400, message: 'Ryhmän lisääminen lomakepohjan asetuksiin ei onnistu'});
                }, 500);
                return deferred.promise;

            }

            return ApplicationFormConfiguration;
        }]
    );
