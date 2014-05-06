'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.factory')
    .factory('TarjontaAPI',[ '$resource', '_', function ($resource, _) {
        console.log('****** TarjonstaAPI service factory ***');
        return {
            tarjontaHaeKaikki: $resource('https://itest-virkailija.oph.ware.fi/tarjonta-service/rest/v1/haku/findAll', {}, {
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
        }
    }]);
