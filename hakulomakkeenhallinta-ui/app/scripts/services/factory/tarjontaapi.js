'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.factory')
    .factory('TarjontaAPI',['$rootScope', '$resource', '_','Props', '$q', '$http', function ($rootScope, $resource, _, Props, $q, $http) {

        var TarjontaAPI = {};

        /**
         * Hakee hakukoteen tiedot haun id:llä
         * @param hakuOid: hakukohteen id
         * @returns {promise}
         */
        TarjontaAPI.fetchHakukohdeInfo = function(hakuOid) {
            var deffered = $q.defer();
            $rootScope.LOGS('TarjontaAPI fetchHakukohdeInfo haku oid:',hakuOid);
            $http.get(Props.tarjontaAPI+"/hakukohde/"+hakuOid).success(
                function(data) {
                    if(data.result){
                        $rootScope.LOGS('TarjontaAPI', data.result);
                        deffered.resolve(data.result);
                    }
                });

            return deffered.promise;
        };

        /**
         * Heataan käyttäjän organisaation liittyvät hakukohteet
         * @param hakuOid:haun id
         * @param userOrganisations: käyttäjän organisaatiot
         * @returns {Array}: palauttaa käyttäjän hakukohteet
         */
        TarjontaAPI.usersApplicationOptions = function(hakuOid, userOrganisations ) {
            var deferred = $q.defer();
            var applicationOptions = [];
            $rootScope.LOGS('TarjontaAPI', ' haku oid:',hakuOid);
            $rootScope.LOGS('TarjontaAPI', ' organisaatio: ',userOrganisations);
            $http.get(Props.tarjontaAPI+"/hakukohde/search", {
                params: {
                    organisationOid: userOrganisations,
                    hakuOid: hakuOid
                }
            }).success(function(data) {
                _.each(data.result.tulokset, function(org) {
                    applicationOptions.push(org);
                });
                deferred.resolve(applicationOptions);
            });
            return deferred.promise;
//            return applicationOptions;
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
