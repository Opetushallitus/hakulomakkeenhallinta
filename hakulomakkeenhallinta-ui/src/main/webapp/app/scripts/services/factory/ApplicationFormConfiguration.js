'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.factory')
    .factory('ApplicationFormConfiguration', ['$rootScope', '$resource', 'Props', '$q', '_', '$timeout', '$http', 'TarjontaAPI',
        function ($rootScope, $resource, Props, $q, _, $timeout, $http, TarjontaAPI) {
            var ApplicationFormConfiguration = {};

            var formConfigurationUri = window.url("haku-app.formConfiguration");
            var FormConfiguration = $resource(formConfigurationUri + '/:_id',
                {_id: '@_id'},
                {
                    getFormTemplates: {
                        method: 'GET',
                        isArray: true,
                        url: formConfigurationUri + '/templates'
                    },
                    changeFormConfigurationTemplate: {
                        method: 'POST',
                        url: formConfigurationUri + '/:_asId/formTemplate',
                        params: { _asId: '@_asId'}
                    },
                    setFormConfiguration: {
                        method: 'POST',
                        url: formConfigurationUri + '/:_asId/groupConfiguration/:_groupId',
                        params: { _asId: '@_asId', _groupId: '@_groupId'}
                    },
                    deleteFormConfiguration: {
                        method: 'POST',
                        url: formConfigurationUri + '/:_asId/groupConfiguration/:_groupId/delete',
                        params: { _asId: '@_asId', _groupId: '@_groupId'}
                    }
                }
            );

            var rajaavatHakukohderyhmatLastModified = {};
            var priorisoivatHakukohderyhmatLastModified = {};
            var Ataru = {
                getRajaavatHakukohderyhmat: function (hakuOid) {
                    return $http.get(window.url("lomake-editori.rajaavat-hakukohderyhmat", hakuOid)).then(function (response) {
                        rajaavatHakukohderyhmatLastModified[hakuOid] = rajaavatHakukohderyhmatLastModified[hakuOid] || {};
                        response.data.forEach(function (ryhma) {
                            rajaavatHakukohderyhmatLastModified[hakuOid][ryhma["hakukohderyhma-oid"]] = response.headers('Last-Modified');
                        });
                        return response.data;
                    });
                },
                getPriorisoivatHakukohderyhmat: function (hakuOid) {
                    return $http.get(window.url("lomake-editori.priorisoivat-hakukohderyhmat", hakuOid)).then(function (response) {
                        priorisoivatHakukohderyhmatLastModified[hakuOid] = priorisoivatHakukohderyhmatLastModified[hakuOid] || {};
                        response.data.forEach(function (ryhma) {
                            priorisoivatHakukohderyhmatLastModified[hakuOid][ryhma["hakukohderyhma-oid"]] = response.headers('Last-Modified');
                        });
                        return response.data;
                    });
                },
                putRajaavaHakukohderyhma: function (hakuOid, hakukohderyhmaOid, body) {
                    var headers = {};
                    if (!rajaavatHakukohderyhmatLastModified[hakuOid] || !rajaavatHakukohderyhmatLastModified[hakuOid][hakukohderyhmaOid]) {
                        headers["If-None-Match"] = "*";
                    } else {
                        headers["If-Unmodified-Since"] = rajaavatHakukohderyhmatLastModified[hakuOid][hakukohderyhmaOid]
                    }
                    return $http.put(
                        window.url("lomake-editori.rajaava-hakukohderyhma", hakuOid, hakukohderyhmaOid),
                        body,
                        { headers: headers }
                    ).then(function (response) { return response.data; });
                },
                putPriorisoivaHakukohderyhma: function (hakuOid, hakukohderyhmaOid, body) {
                    var headers = {};
                    if (!priorisoivatHakukohderyhmatLastModified[hakuOid] || !priorisoivatHakukohderyhmatLastModified[hakuOid][hakukohderyhmaOid]) {
                        headers["If-None-Match"] = "*";
                    } else {
                        headers["If-Unmodified-Since"] = priorisoivatHakukohderyhmatLastModified[hakuOid][hakukohderyhmaOid]
                    }
                    return $http.put(
                        window.url("lomake-editori.priorisoiva-hakukohderyhma", hakuOid, hakukohderyhmaOid),
                        body,
                        { headers: headers }
                    ).then(function (response) { return response.data });
                },
                deleteRajaavaHakukohderyhma: function (hakuOid, hakukohderyhmaOid) {
                    return $http.delete(window.url("lomake-editori.rajaava-hakukohderyhma", hakuOid, hakukohderyhmaOid)).then(function (response) {
                        rajaavatHakukohderyhmatLastModified[hakuOid][hakukohderyhmaOid] = null;
                        return response.data;
                    });
                },
                deletePriorisoivaHakukohderyhma: function (hakuOid, hakukohderyhmaOid) {
                    return $http.delete(window.url("lomake-editori.priorisoiva-hakukohderyhma", hakuOid, hakukohderyhmaOid)).then(function (response) {
                        priorisoivatHakukohderyhmatLastModified[hakuOid][hakukohderyhmaOid] = null;
                        return response.data;
                    });
                }
            };

            ApplicationFormConfiguration.vaihdaHaunLomakepohja = function (haku, lomakepohjaId) {
                $rootScope.LOGS('ApplicationFormConfiguration', 'vaihdaHaunLomakepohja()', haku.oid, lomakepohjaId);
                if (haku.ataruLomake) {
                    return $q.reject({
                        status: 400,
                        statusText: "Yritettiin vaihtaa lomakepohjaa Hakemuspalvelun lomaketta käyttävässä haussa"
                    });
                }
                var formConf = {
                    applicationSystemId: haku.oid,
                    formTemplateType: lomakepohjaId
                };
                return FormConfiguration.changeFormConfigurationTemplate({_asId: haku.oid}, formConf).$promise
            };

            ApplicationFormConfiguration.asetaHakukohderyhmaRajoite = function (haku, hakukohdeRyhmaOid, hakukohdeRajoite) {
                $rootScope.LOGS('ApplicationFormConfiguration', 'asetaHakukohderyhmaRajoite()', haku.oid, hakukohdeRyhmaOid, hakukohdeRajoite);
                if (haku.ataruLomake) {
                    return Ataru.putRajaavaHakukohderyhma(haku.oid, hakukohdeRyhmaOid, {
                        "haku-oid": haku.oid,
                        "hakukohderyhma-oid": hakukohdeRyhmaOid,
                        raja: hakukohdeRajoite
                    });
                } else {
                    var groupConf = {
                        groupId: hakukohdeRyhmaOid,
                        type: 'hakukohde_rajaava',
                        configurations: {
                            maximumNumberOf: hakukohdeRajoite
                        }
                    };
                    return FormConfiguration.setFormConfiguration({ _asId: haku.oid, _groupId: hakukohdeRyhmaOid }, groupConf).$promise;
                }
            };

            ApplicationFormConfiguration.asetaHakukohdePrioriteetit = function (haku, hakukohderyhmaOid, prioriteetit) {
                var ps = [TarjontaAPI.setHakukohdePrioriteetit(hakukohderyhmaOid, prioriteetit)];
                if (haku.ataruLomake) {
                    var asetetutPrioriteetit = _.chain(prioriteetit)
                        .filter(function (p) { return _.has(p, 'prioriteetti'); })
                        .sortBy(function (p) { return p.prioriteetti; })
                        .reduce(function (acc, p) {
                            if (acc.viimeisinPrioriteetti === p.prioriteetti) {
                                _.last(acc.prioriteetit).push(p.hakukohdeOid);
                            } else {
                                acc.viimeisinPrioriteetti = p.prioriteetti;
                                acc.prioriteetit.push([p.hakukohdeOid]);
                            }
                            return acc;
                        }, {viimeisinPrioriteetti: null,
                            prioriteetit: []})
                        .value().prioriteetit;
                    var priorisoimattomat = _.chain(prioriteetit)
                        .reject(function (p) { return _.has(p, 'prioriteetti'); })
                        .map(function (p) { return p.hakukohdeOid; })
                        .value();
                    if (!_.isEmpty(priorisoimattomat)) {
                        asetetutPrioriteetit.push(priorisoimattomat);
                    }
                    ps.push(Ataru.putPriorisoivaHakukohderyhma(haku.oid, hakukohderyhmaOid, {
                        "haku-oid": haku.oid,
                        "hakukohderyhma-oid": hakukohderyhmaOid,
                        prioriteetit: asetetutPrioriteetit
                    }));
                }
                return $q.all(ps);
            };

            ApplicationFormConfiguration.tallennaHakukohderyhmanOsoite = function (haku, hakukohdeRyhmaOid, hakukohdeRyhmanOsoite) {
                $rootScope.LOGS('ApplicationFormConfiguration', 'tallennaHakukohderyhmanOsoite()', haku.oid, hakukohdeRyhmaOid, hakukohdeRyhmanOsoite);
                if (haku.ataruLomake) {
                    return $q.reject({
                        status: 400,
                        statusText: "Yritettiin asettaa osoite Hakemuspalvelun lomaketta käyttävässä haussa"
                    });
                }
                var groupConf =
                {
                    groupId: hakukohdeRyhmaOid,
                    type: 'hakukohde_liiteosoite',
                    configurations: {
                        useFirstAoAddress: hakukohdeRyhmanOsoite.useFirstAoAddress,
                        addressRecipient: hakukohdeRyhmanOsoite.address.recipient,
                        addressStreet: hakukohdeRyhmanOsoite.address.street,
                        addressPostalCode: hakukohdeRyhmanOsoite.address.postCode,
                        addressPostOffice: hakukohdeRyhmanOsoite.address.postOffice,
                        deadline: hakukohdeRyhmanOsoite.deliveryDue,
                        helpText: hakukohdeRyhmanOsoite.helpText
                    }
                };
                return FormConfiguration.setFormConfiguration({ _asId: haku.oid, _groupId: hakukohdeRyhmaOid }, groupConf).$promise;
            };

            ApplicationFormConfiguration.haeLomakepohjat = function (haku) {
                $rootScope.LOGS('ApplicationFormConfiguration', 'haeLomakepohjat()');
                if (haku.ataruLomake) {
                    return $q.when([{
                        id: "ATARU",
                        name: {
                            translations: {
                                fi: "Hakemuspalvelun lomake",
                                sv: "SV: Hakemuspalvelun lomake",
                                en: "EN: Hakemuspalvelun lomake"
                            }
                        }
                    }]);
                } else {
                    return FormConfiguration.getFormTemplates().$promise;
                }
            };

            ApplicationFormConfiguration.haeDefaultLomakepohja = function (haku) {
                $rootScope.LOGS('ApplicationFormConfiguration', 'haeDefaultLomakepohja()');
                if (haku.ataruLomake) {
                    return $q.when("ATARU");
                } else {
                    return $http.get(formConfigurationUri + '/' + haku.oid + '/defaultTemplate');
                }
            };

            ApplicationFormConfiguration.haeLomakepohjanAsetukset = function (haku) {
                $rootScope.LOGS('ApplicationFormConfiguration', 'haeLomakepohjanAsetukset()', haku.oid);
                if (haku.ataruLomake) {
                    return $q.all({
                        rajaavat: Ataru.getRajaavatHakukohderyhmat(haku.oid),
                        priorisoivat: Ataru.getPriorisoivatHakukohderyhmat(haku.oid)
                    }).then(function (o) {
                        var configurations = [];
                        o.rajaavat.forEach(function (r) {
                            configurations.push({
                                groupId: r["hakukohderyhma-oid"],
                                type: 'hakukohde_rajaava',
                                configurations: {
                                    maximumNumberOf: r.raja
                                }
                            });
                        });
                        o.priorisoivat.forEach(function (r) {
                            configurations.push({
                                groupId: r["hakukohderyhma-oid"],
                                type: 'hakukohde_priorisoiva'
                            });
                        });
                        return {
                            formTemplateType: "ATARU",
                            groupConfigurations: configurations
                        }
                    });
                } else {
                    return FormConfiguration.get({'_id': haku.oid}).$promise;
                }
            };

            ApplicationFormConfiguration.poistaHakukohderyhmaLomakkeenAsetuksista = function (haku, rajoiteRyhma) {
                $rootScope.LOGS('ApplicationFormConfiguration', 'poistaHakukohderyhmaLomakkeenAsetuksista()', haku.oid, rajoiteRyhma);
                if (haku.ataruLomake) {
                    if (rajoiteRyhma.type === 'hakukohde_rajaava') {
                        return Ataru.deleteRajaavaHakukohderyhma(haku.oid, rajoiteRyhma.groupId);
                    }
                    if (rajoiteRyhma.type === 'hakukohde_priorisoiva') {
                        return Ataru.deletePriorisoivaHakukohderyhma(haku.oid, rajoiteRyhma.groupId);
                    }
                } else {
                    var groupConf = {
                        groupId: rajoiteRyhma.groupId,
                        type: rajoiteRyhma.type
                    };
                    return FormConfiguration.deleteFormConfiguration({ _asId: haku.oid, _groupId: rajoiteRyhma.groupId }, groupConf).$promise;
                }
            };

            ApplicationFormConfiguration.lisaaRyhmaLomakepohjanAsetuksiin = function (haku, hakukohdeRyhma) {
                $rootScope.LOGS('ApplicationFormConfiguration', 'lisaaRyhmaLomakepohjanAsetuksiin()', haku.oid, hakukohdeRyhma);
                if (haku.ataruLomake) {
                    if (hakukohdeRyhma.type === 'hakukohde_rajaava') {
                        return Ataru.putRajaavaHakukohderyhma(haku.oid, hakukohdeRyhma.groupId, {
                            "haku-oid": haku.oid,
                            "hakukohderyhma-oid": hakukohdeRyhma.groupId,
                            raja: 0
                        });
                    }
                    if (hakukohdeRyhma.type === 'hakukohde_priorisoiva') {
                        return Ataru.putPriorisoivaHakukohderyhma(haku.oid, hakukohdeRyhma.groupId, {
                            "haku-oid": haku.oid,
                            "hakukohderyhma-oid": hakukohdeRyhma.groupId,
                            prioriteetit: []
                        });
                    }
                } else {
                    var groupConf = {
                        groupId: hakukohdeRyhma.groupId,
                        type: hakukohdeRyhma.type
                    };
                    return FormConfiguration.setFormConfiguration({ _asId: haku.oid, _groupId: hakukohdeRyhma.groupId }, groupConf).$promise
                }
            };

            return ApplicationFormConfiguration;
        }]
    );
