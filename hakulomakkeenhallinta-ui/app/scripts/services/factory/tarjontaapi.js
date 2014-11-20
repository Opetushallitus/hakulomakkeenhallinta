'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.factory')
    .factory('TarjontaAPI', [ '$rootScope', '$resource', '_', 'Props', '$q', '$http', 'Organisaatio',
        function ($rootScope, $resource, _, Props, $q, $http, Organisaatio) {

            var TarjontaAPI = {};

            /**
             * Hakee hakukoteen tiedot haun id:llä
             * @param hakuOid: hakukohteen id
             * @returns {promise}
             */
            TarjontaAPI.fetchHakukohdeInfo = function (hakuOid) {
                var deffered = $q.defer();
                $rootScope.LOGS('TarjontaAPI fetchHakukohdeInfo haku oid:', hakuOid);
                $http.get(Props.tarjontaAPI + "/hakukohde/" + hakuOid).success(
                    function (data) {
                        if (data.result) {
                            $rootScope.LOGS('TarjontaAPI', data.result);
                            deffered.resolve(data.result);
                        } else if (data.status === 'NOT_FOUND') {
                            $rootScope.LOGS('TarjontaAPI', data);
                            deffered.resolve(data.status);
                        }
                    }
                );
                return deffered.promise;
            };
            /**
             * Heataan käyttäjän organisaation liittyvät hakukohteet
             * @param hakuOid:haun id
             * @param userOrganisations: käyttäjän organisaatiot
             * @returns {Array}: palauttaa käyttäjän hakukohteet
             */
            TarjontaAPI.usersApplicationOptions = function (hakuOid, userOrganisations) {
                var deferred = $q.defer();
                var applicationOptions = [];
                $rootScope.LOGS('TarjontaAPI', ' haku oid:', hakuOid);
                $rootScope.LOGS('TarjontaAPI', ' organisaatio: ', userOrganisations);

                $http.get(Props.tarjontaAPI + "/hakukohde/search", {
                        params: {
                            organisationOid: userOrganisations,
                            hakuOid: hakuOid
                        }
                    }
                ).success( function (data) {
                        _.each(data.result.tulokset, function (org) {
                                applicationOptions.push(org);
                            }
                        );
                        deferred.resolve(applicationOptions);
                    }
                );
                return deferred.promise;
            };
            /**
             * Heataan käyttäjän organisaation liittyvät hakukohteet
             * @param hakuOid:haun id
             * @param userOrganisations: käyttäjän organisaatiot
             * @returns {Array}: palauttaa käyttäjän hakukohteet
             */
            TarjontaAPI.usersApplicationOptions2 = function (hakuOid, userOrganisations) {
                var deferred = $q.defer();

                $http.get(Props.tarjontaAPI + "/hakukohde/search", {
                        params: {
                            organisationOid: userOrganisations,
                            hakuOid: hakuOid
                        }
                    }
                ).success( function (data) {
                    // Tulokset on lista hakukohteita (ao)
                    getHakukohdeJoukot(data.result.tulokset).then(
                        function (groups) {
                            if (groups.length > 0) {
                                deferred.resolve(data.result.tulokset.concat(groups));
                            } else {
                                console.log('groups 0');
                                deferred.resolve(data.result.tulokset);
                            }

                        }
                    );
                });
                return deferred.promise;
            };
            /**
             * Hakee kayttäjän organisaation hakukohteisiin perustuen
             * ne hakukohdejoukot ja ryhmät joihin käyttäjä
             * voi kuulua
             * @param applicationOptions käyttäjän hakukohteet
             * @returns {promise}
             */
            function getHakukohdeJoukot(applicationOptions) {
                var deferred = $q.defer();
                var hakukohteet = [];
                var hakukohdeOids = _.chain(applicationOptions)
                    .map(function (hakuorganisaationHakukohteet) { return hakuorganisaationHakukohteet.tulokset; })
                    .flatten()
                    .map(function (hakukohde) { return hakukohde.oid; })
                    .value();

                _.each(hakukohdeOids, function (oid) {
                        hakukohteet.push(TarjontaAPI.fetchHakukohdeInfo(oid));
                    }
                );

                $q.all(hakukohteet).then(
                    function (data) {
                    var organisaatiot = _.chain(data)
                        .pluck('organisaatioRyhmaOids')
                        .flatten(true)
                        .uniq()
                        .without(undefined)
                        .map(function (ryhmaOid) { return Organisaatio.getOrganisationData(ryhmaOid); })
                        .value();

                        $q.all(organisaatiot).then(
                            function (groups) {
                                deferred.resolve(groups);
                            }
                        );
                    }
                );
                return deferred.promise;
            };

            TarjontaAPI.query = function () {
                $resource(Props.tarjontaAPI + '/haku/findAll', {}, {
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
                })
            };

            var tarjonta = $resource(Props.tarjontaAPI + '/hakukohde/search', {},
                {
                    getRyhmanHakukohteet: {
                    method: 'GET',
                    params: {
                            organisaatioRyhmaOid: '@_hakukohdeRyhmanOid'
                    },
                    isArray: false
                    }
                });
            /**
             * Haetaan hakukohderyhmään kuuluvat hakukohteet
             * @param hakukohdeRyhmanOid hakukohderyhman id
             * @returns {promise}
             */
            TarjontaAPI.haeRyhmanHakukohteet = function (hakukohdeRyhmanOid) {
                var deferred = $q.defer();

                tarjonta.getRyhmanHakukohteet({ organisaatioRyhmaOid: hakukohdeRyhmanOid }).$promise.then(
                        function (data) {
                            deferred.resolve(angular.fromJson(data).result);
                        }
                    );
                return deferred.promise;
            };

            return TarjontaAPI;
        }]);
