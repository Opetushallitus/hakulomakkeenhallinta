'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.factory')
    .factory('TarjontaAPI',
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
         * Haetaan hakuun liittyvät priorisoivat ja rajavaavat hakukohderyhmät
         * sekä kyseisten hakukohderyhmien tiedot
         * @param hakuOid
         * @returns {promise}
         */
        TarjontaAPI.getHakuApplicatioOptionGroups = function (hakuOid) {
            var deferred = $q.defer();
            $http.get(Props.tarjontaAPI + '/haku/' +hakuOid
            ).success(function (data) {
                    getUserHakukohdeRyhmat(data.result.organisaatioryhmat).then(
                        function (data) {
                            deferred.resolve(data);
                        }
                    );
                }).error(function (resp) {
                    $rootScope.LOGS('TarjontaAPI', 'getHakuApplicatioOptionGroups()', 'ERROR', resp);
                    deferred.reject(resp);
                });

            return deferred.promise;
        };
        /**
         * Suodatetaan hakuun liittyvistä ryhmistä rajaavat ja priorisoivat
         * hakukohderyhmät ja haetaan organisaatio palvelusta niiden tiedot
         * @param organisaatioryhmat kaikki hakukohteeseen liittyvät ryhmät
         * @returns {promise}
         */
        function getUserHakukohdeRyhmat(organisaatioryhmat) {
            var deferred = $q.defer();
            var hakukohdeRyhmat = [];
            _.each(organisaatioryhmat, function (oid) {
                hakukohdeRyhmat.push(Organisaatio.getOrganisationData(oid));
            });
            $q.all(hakukohdeRyhmat).then(
                function (data) {
                    data = _.filter(data, function (ryhma) {
                        return (_.contains(ryhma.kayttoryhmat, 'hakukohde_rajaava') ||
                            _.contains(ryhma.kayttoryhmat, 'hakukohde_priorisoiva'))
                            && _.contains(ryhma.ryhmatyypit, 'hakukohde'); });
                    deferred.resolve(data);
                }
            );
            return deferred.promise;
        }
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
        /**
         * Haetaan hakuun ja siinä olevaan hakukohderyhmään kuuluvat hakukohteet
         * @param applicationSystemId haun Id alias lomakkeen id
         * @param hakukohdeRyhmanOid hakukohderyhman id
         * @returns {promise}
         */
        TarjontaAPI.haeRyhmanHakukohteet = function (applicationSystemId, hakukohdeRyhmanOid) {
            var deferred = $q.defer();
            $http.get(Props.tarjontaAPI + '/hakukohde/search', {
                params: {
                    organisaatioRyhmaOid: hakukohdeRyhmanOid,
                    hakuOid: applicationSystemId
                }
            }).success(
                function (data) {
                    data = _.flatten(_.map(data.result.tulokset,
                            function (data1){
                                return _.each(data1.tulokset,
                                    function(data2) {
                                        data2.tarjoaja = {};
                                        data2.tarjoaja.nimi = data1.nimi;
                                        return data2;
                                    }
                                )
                            }
                        )
                    );
                    deferred.resolve(data);
                }
            ).error(
                function (resp) {
                    deferred.reject(resp);
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
                    hakukohde.toiminto = 'LISAA';
                    lisattavat.push(hakukohde);
                }
            );
            //TODO: poista logitukset kun ei enään tarpeen
            console.log('#### TarjontaAPI.lisaaHakukohteetRyhmaan', lisattavat);
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
        /**
         * Tarkistetaan käyttäjän autentikaatio tarjontaan
         * @returns {promise}
         */
        TarjontaAPI.checkTarjontaAuthentication = function () {
            var deferred = $q.defer();
            $http.get(Props.tarjontaAPI + '/permission/authorize')
                .success(function (data) {
                    if (data.status === 'OK') {
                        deferred.resolve(data);
                    } else {
                        deferred.reject(data);
                    }
                })
                .error(function (resp) {
                    deferred.reject(resp);
                });
            return deferred.promise;
        };
        return TarjontaAPI;
    }
);

