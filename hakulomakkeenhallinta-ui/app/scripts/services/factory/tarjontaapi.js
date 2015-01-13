'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.factory')
    .factory('TarjontaAPI', [ '$rootScope', '$resource', '_', 'Props', '$q', '$http', 'Organisaatio',
        function ($rootScope, $resource, _, Props, $q, $http, Organisaatio) {

            var TarjontaAPI = {};

            /**
             * Hakee hakukohteen tiedot hakukohteen id:llä
             * @param hakuOid: hakukohteen id
             * @returns {promise}
             */
            TarjontaAPI.fetchHakukohdeInfo = function (hakuOid) {
                var deffered = $q.defer();
                $http.get(Props.tarjontaAPI + "/hakukohde/" + hakuOid).success(
                    function (data) {
                        if (data.result) {
                            deffered.resolve(data.result);
                        } else if (data.status === 'NOT_FOUND') {
                            $rootScope.LOGS('TarjontaAPI hakukohde  NOT_FOUND', data);
                            deffered.resolve(data.status);
                        }
                    }
                );
                return deffered.promise;
            };
            /**
             * Hakee haun tiedot haun id:llä
             * @param oid: haun id
             * @returns {promise}
             */
            TarjontaAPI.fetchHakuInfo = function (oid) {
                var deffered = $q.defer();
                $rootScope.LOGS('TarjontaAPI fetchHakuInfo haku oid:', oid);
                $http.get(Props.tarjontaAPI + "/haku/" + oid).success(
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
                ).success(function (data) {
                    // Tulokset on lista hakukohteita (ao)
                    getHakukohdeJoukot(data.result.tulokset).then(
                        function (groups) {
                            if (groups.length > 0) {
                                deferred.resolve(data.result.tulokset.concat(groups));
                            } else {
                                deferred.resolve(data.result.tulokset);
                            }

                        }
                    );
                });
                return deferred.promise;
            };
            /**
             * Heataan käyttäjän organisaation liittyvät hakukohderyhmät
             * @param hakuOid:haun id
             * @param userOrganisation: käyttäjän organisaatio
             * @returns {Array}: palauttaa käyttäjän hakukohderyhmät
             */
            TarjontaAPI.usersApplicationOptionGroups = function (hakuOid, userOrganisation) {
                var deferred = $q.defer();

                $http.get(Props.tarjontaAPI + "/hakukohde/search", {
                        params: {
                            organisationOid: userOrganisation,
                            hakuOid: hakuOid
                        }
                    }
                ).success(function (data) {
                    // Tulokset on lista hakukohteita (ao)
                    getHakukohdeJoukot(data.result.tulokset).then(
                        function (groups) {
                            deferred.resolve(groups);
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
            /**
             * Heataan tarjonnasta haut hakuparametrien perusteella
             * @param hakuvuosi
             * @param hakukausi
             * @param hakutyyppi
             * @returns {promise}
             */
            TarjontaAPI.haeHautParametreilla = function (hakuvuosi, hakukausi, hakutyyppi) {
                $rootScope.LOGS('TarjontaAPI', 'haeHautParametreilla');
                var deferred = $q.defer();
                $http.get(Props.tarjontaAPI + "/haku/", {
                    params: {
                        HAKUVUOSI: hakuvuosi,
                        HAKUKAUSI: hakukausi + '#1',
                        HAKUTYYPPI: hakutyyppi + '#1',
                        TILA: 'NOT_POISTETTU',
                        COUNT: 1000
                    }
                }).success(
                    function (data) {
                        var haut = [];
                        _.each(data.result, function (oid) {
                                haut.push(TarjontaAPI.fetchHakuInfo(oid));
                            }
                        );
                        $q.all(haut).then(
                            function (data) {
                                data = _.filter(data, function (haku) { return haku.tila === 'JULKAISTU' || haku.tila === 'VALMIS'; });
                                deferred.resolve(data);
                            }
                        );

                    }
                );
                return deferred.promise;
            }

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
            /**
             * Poistetaan hakukohde hakukohderyhmästä
             * @param hakukohdeRyhma
             * @param hakukohde
             * @returns {promise}
             */
            TarjontaAPI.poistaHakukohdeRyhmasta = function (hakukohdeRyhma, hakukohde) {
                var deferred = $q.defer();
                $http.post(Props.tarjontaAPI + '/hakukohde/ryhmat/operate',[
                    {
                        toiminto: 'POISTA',
                        hakukohdeOid: hakukohde.oid,
                        ryhmaOid: hakukohdeRyhma.oid
                    }
                ]).success(function (data) {
                    if (data.status === 'OK') {
                        deferred.resolve(data);
                    }else {
                        deferred.reject(data);
                    }
                }).error(function (resp) {
                    deferred.reject(resp);
                });
                return deferred.promise;
            };
            /**
             * Lisätään hakukohteet hakukohderyhmään
             * @param hakukohdeRyhma {}
             * @param hakukohteetOids [] taulukko lisättävistä hakukohteiden oid:sta
             * @returns {promise}
             */
            TarjontaAPI.lisaaHakukohteetRyhmaan = function (hakukohdeRyhma, hakukohteetOids) {
                var deferred = $q.defer();

                var lisattavat = [];
                _.each(hakukohteetOids, function (hakukohdeOid) {
                        var hakukohde = {};
                        hakukohde.hakukohdeOid = hakukohdeOid;
                        hakukohde.ryhmaOid = hakukohdeRyhma.oid;
                        hakukohde.toiminto = 'LISAA'
                        lisattavat.push(hakukohde);
                    }
                );
                //deferred.resolve(lisattavat);

                $http.post(Props.tarjontaAPI + '/hakukohde/ryhmat/operate', lisattavat
                    ).success(function (data) {
                        console.log('**** success: ', data);
                        if (data.status === 'OK') {
                            deferred.resolve(data);
                        }else {
                            deferred.reject(data);
                        }
                    }).error(function (resp) {
                        console.log('**** error: ', resp);
                        deferred.reject(resp);
                });
                return deferred.promise;
            };

            return TarjontaAPI;
        }]);

