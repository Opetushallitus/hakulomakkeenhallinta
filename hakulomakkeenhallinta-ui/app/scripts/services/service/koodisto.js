'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.service', [])
    .service('Koodisto', ['$http', '$q', 'Props', '_',
        function Koodisto($http, $q, Props) {
            var postinumerot = [],
                kaudet = [],
                hakutyypit = [];

            /**
             * Hakee koodistosta postinumerot ja postitoimipaikat
             * @returns {promise}
             */
            this.getPostiKoodit = function () {
                var deferred = $q.defer();
                if (postinumerot.length > 0) {
                    deferred.resolve(postinumerot);
                } else {
                    $http.get(Props.koodisto + '/posti/koodi?onlyValidKoodis=true').success(
                        function (data) {
                            postinumerot = data;
                            deferred.resolve(data);
                        }
                    );
                }
                return deferred.promise;
            };
            /**
             * Hakee koodistosta hakukausien koodit
             * @returns {promise}
             */
            this.getKausiKoodit = function () {
                var deferred = $q.defer();
                if (kaudet.length > 0) {
                    deferred.resolve(kaudet);
                } else {
                    $http.get(Props.koodisto + '/kausi/koodi?onlyValidKoodis=true').success(
                        function(data) {
                            data = _.map(data, function (kk) {
                                return {
                                    period: kk.koodiUri,
                                    translations: {
                                        fi: _.find(kk.metadata, function (kieli) { return kieli.kieli.toLowerCase() === 'fi'; }).nimi,
                                        sv: _.find(kk.metadata, function (kieli) { return kieli.kieli.toLowerCase() === 'sv'; }).nimi,
                                        en: _.find(kk.metadata, function (kieli) { return kieli.kieli.toLowerCase() === 'en'; }).nimi
                                    }
                                };
                            });
                            deferred.resolve(data);
                        }
                    );
                }
                return deferred.promise;
            };
            /**
             * Hakee koodistosta hakutyypien koodit
             * @returns {promise}
             */
            this.getHakutyyppiKoodit = function () {
                var deferred = $q.defer();
                if (hakutyypit.length > 0) {
                    deferred.resolve(hakutyypit);
                } else {
                    $http.get(Props.koodisto + '/hakutyyppi/koodi?onlyValidKoodis=true').success(
                        function(data) {
                            data = _.map(data, function (hakuType) {
                                    return {
                                        type: hakuType.koodiUri,
                                        translations: {
                                            fi: _.find(hakuType.metadata, function (kieli) { return kieli.kieli.toLowerCase() === 'fi'; }).nimi,
                                            sv: _.find(hakuType.metadata, function (kieli) { return kieli.kieli.toLowerCase() === 'sv'; }).nimi,
                                            en: _.find(hakuType.metadata, function (kieli) { return kieli.kieli.toLowerCase() === 'fi'; }).nimi
                                            //englannikieliset metadata käännökset puuttuvat koodistosta.
                                        }
                                    };
                                }
                            );
                            deferred.resolve(data);
                        }
                    );
                }
                return deferred.promise;
            };
        }
    ]);
