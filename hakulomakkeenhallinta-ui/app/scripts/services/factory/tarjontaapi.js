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
                        getHakukohdeJoukot(applicationOptions).then(
                            function (data) {
                                deferred.resolve(data);
                            }
                        );

                    }
                );
                return deferred.promise;
            };
            /**
             * Hakee kayttäjän hakukohteisiin perustuen
             * ne hakukohdejoukot ja ryhmät joihin käyttäjä
             * voi kuulua
             * @param org käyttäjän hakukohteet
             * @returns {promise}
             */
            function getHakukohdeJoukot (org) {
                var deferred = $q.defer();
                var ao = org,
                    hakukohteet = [],
                    hakukohdeOids = [],
                    organisaatiot = [];

                for (var t = 0; t < ao.length; t++ ) {
                    for (var i = 0; i < ao[t].tulokset.length; i++) {
                        hakukohteet.push(TarjontaAPI.fetchHakukohdeInfo(ao[t].tulokset[i].oid));
                    }
                }
                // for (var t = 0, tl = ao.length; t < tl; ) {
                //     for (var i = 0, il = ao[t].tulokset.length; i < il; t += 1, i += 1) {
                //         hakukohdeOids.push(ao[t].tulokset[i].oid);
                //     }
                // }
                // for (var r = 0, rl = hakukohdeOids.length; r < rl ; r += 1) {
                //     var hkInfo = TarjontaAPI.fetchHakukohdeInfo(hakukohdeOids[r]);
                //     hakukohteet.push(hkInfo);
                // }

                $q.all(hakukohteet).then(
                    function (data) {
                        for (var d = 0, dl = data.length; d < dl; d += 1) {
                            if (data[d].organisaatioRyhmaOids) {
                                var orgInfo = Organisaatio.getOrganisation2(data[d].organisaatioRyhmaOids);
                                organisaatiot.push(orgInfo);
                            }
                        }
                        $q.all(organisaatiot).then(
                            function (data) {
                                for (var orgs = 0, orgDl= data.length; orgs < orgDl; orgs += 1){
                                    org.push(data[orgs]);
                                }
                                deferred.resolve(org);
                            }
                        );
                    }
                );
                return deferred.promise;
            };

            TarjontaAPI.query = function(){
                $resource(Props.tarjontaAPI+'/haku/findAll', {}, {
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


            return TarjontaAPI;
        }]);
