'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.factory')
    .factory('ApplicationFormConfiguration', ['$rootScope', '$resource', 'Props', '$q', '_', '$timeout',
        function ($rootScope, $resource, Props, $q, _, $timeout) {
            var ApplicationFormConfiguration = {};
            /**
             * Liitää haun valittuun lomakepohjaan
             * @param haunOid haun id
             * @param lomakepohjaOid lomakepohjan id
             * @returns {promise}
             */
            ApplicationFormConfiguration.tallennaLiitahakuLomakepohjaan = function (haunOid, lomakepohjaOid) {
                var deferred = $q.defer();
                $rootScope.LOGS('ApplicationFormConfiguration', 'TODO: tällä', 'tallennaLiitahakuLomakepohjaan()', haunOid, lomakepohjaOid);
                //TODO: tälle backend post kun se on saatavilla
                $timeout(function () {
                    deferred.resolve({status: 200, message: 'hakemuslomakkeen.luonti.onnistui'});
//                    deferred.reject({status:400, message: 'hakemuslomakkeen.luonti.onnistui'});
                }, 500);
                return deferred.promise;
            };
            /**
             * Vaihtaa haun lomakepohjan
             *  @param applicationSysmtemId hakulomakkeen id
             * @param haunOid haun id
             * @param lomakepohjaOid lomakepohjan id
             * @returns {promise}
             */
            ApplicationFormConfiguration.vaihdaHaunLomakepohja = function (applicationSystemId ,haunOid, lomakepohjaOid) {
                var deferred = $q.defer();
                $rootScope.LOGS('ApplicationFormConfiguration', 'TODO: tällä', 'vaihdaHaunLomakepohja()',applicationSystemId, haunOid, lomakepohjaOid);
                //TODO: tälle backend post kun se on saatavilla
                $timeout(function () {
                    deferred.resolve({status: 200, message: 'tallennus ok'});
                    //deferred.reject({status:400, message: 'hakemuslomakkeen.luonti.onnistui'});
                }, 500);
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
            //TODO: poista tämä kun backend toteus olemasssa
            var lomakePohjat = [
                {
                    id: '1.2.3.111',
                    translations: {
                        fi: 'Toisen asteen hakulomakepohja testi data',
                        sv: 'Toisen asteen hakulomakepohja testi data (sv)',
                        en: 'Toisen asteen hakulomakepohja testi data (en)'
                    }
                },
                {
                    id: '1.2.3.222',
                    translations: {
                        fi: 'Korkeakoulujen hakulomakepohja testi data',
                        sv: 'Korkeakoulujen hakulomakepohja testi data (sv)',
                        en: 'Korkeakoulujen hakulomakepohja testi data (en)'
                    }
                },
                {
                    id: '1.2.3.333',
                    translations: {
                        fi: 'Kolmas hakulomakepohja testi data',
                        sv: 'Kolmas hakulomakepohja testi data (sv)',
                        en: 'Kolmas hakulomakepohja testi data (en)'
                    }
                }
            ];
            /**
             * Palauttaa taustajärjestelmästä hakulomake pohjat
             * @returns {promise}
             */
            ApplicationFormConfiguration.haeLomakepohjat = function () {
                var deferred = $q.defer();
                $rootScope.LOGS('ApplicationFormConfiguration', 'TODO: tällä', 'haeLomakepohjat()');
                //TODO: tälle backend post kun se on saatavilla
                $timeout(function () {
                    deferred.resolve(lomakePohjat);
//                    deferred.reject({status:400, message: 'hakemuslomakkeen.luonti.onnistui'});
                }, 500);
                return deferred.promise;
            };

            var lomakePohjanAsetukset = {
                applicationFormBaseId: '1.2.3.222',
                applicationSystemForm: '1.2.246.562.29.173465377510', //haun oid
                configurations: [
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
                ]
            };
            ApplicationFormConfiguration.haeLomakepohjanAsetukset = function (applicationSystemId) {
                var deferred = $q.defer();
                $rootScope.LOGS('ApplicationFormConfiguration', 'TODO: tällä', 'haeLomakepohjat()', applicationSystemId);
                //TODO: tälle backend post kun se on saatavilla
                $timeout(function () {
                    deferred.resolve(lomakePohjanAsetukset);
//                    deferred.reject({status:400, message: 'hakemuslomakkeen.luonti.onnistui'});
                }, 500);
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
