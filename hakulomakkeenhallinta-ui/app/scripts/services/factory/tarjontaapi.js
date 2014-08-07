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

/*            TarjontaAPI.fetchHakukohdeInfos = function (hakuOid, callback) {
                var deffered = $q.defer();
                $rootScope.LOGS('## TarjontaAPI fetchHakukohdeInfos haku oids:', hakuOid);
                $http.get(Props.tarjontaAPI + "/hakukohde/" + hakuOid).success(
                    function (data) {
                        if (data.result) {
                            $rootScope.LOGS('TarjontaAPI', data.result);
//                            return callback(data.result);
//                            deffered.resolve(data.result);
                            deffered.resolve(callback(data.result));
                        }
                    }
                );
                return deffered.promise;
            };*/

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
                            console.log('# 1',org);
                            applicationOptions.push(org);
                        }
                    );
                    console.log('getHakukohdeJoukot() --> ')
                    getHakukohdeJoukot(applicationOptions).then(
                        function (data) {
                            console.log('# 6', data);
                            deferred.resolve(data);
                        }
                    );

                }
            );
            return deferred.promise;
//            return applicationOptions;
        };

        function getHakukohdeJoukot (org) {
            var deferred = $q.defer();
            var ao = org,
                hakukohteet = [],
                hakukohdeOids = [],
                organisaatiot = [];

            for (var t = 0, tl = ao.length; t < tl; ) {
                for (var i = 0, il = ao[t].tulokset.length; i < il; t += 1, i += 1) {
                    console.log('# 2', ao[t].tulokset[i].oid, 't',t ,'i',i);
                    hakukohdeOids.push(ao[t].tulokset[i].oid);

                }
            }
            console.log('# 3', hakukohdeOids);
            for (var r = 0, rl = hakukohdeOids.length; r < rl ; r += 1) {
                var hkInfo = TarjontaAPI.fetchHakukohdeInfo(hakukohdeOids[r]);
                hakukohteet.push(hkInfo);
            }

            $q.all(hakukohteet).then(
                function (data) {
                    console.log('# 4', data);
                    for (var d = 0, dl = data.length; d < dl; d += 1) {
                        console.log('##', data[d].organisaatioRyhmaOids);
                        if (data[d].organisaatioRyhmaOids) {
                            var orgInfo = Organisaatio.getOrganisation(data[d].organisaatioRyhmaOids);
                            organisaatiot.push(orgInfo);
                        }
                    }
                    $q.all(organisaatiot).then(
                        function (data) {
                            console.log('# 5', data);
                            for (var o = 0, ol = data.length, o < dl; o += 1){
                                var hakukohdeJoukko = {};
                                tulokset[]
                            }
                            deferred.resolve(org);
                        }
                    );


                }
            );

            /*if (data.organisaatioRyhmaOids) {
                console.log('4&&& ', data);
               Organisaatio.getOrganisation(data.organisaatioRyhmaOids).then(
                    function (data) {
                        console.log('5###', data);
//                                        applicationOptions.push(ao[t]);
                    }
                );
            }*/

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
