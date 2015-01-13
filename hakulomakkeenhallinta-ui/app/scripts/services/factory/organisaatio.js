'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.factory')
    .factory('Organisaatio',[ '$resource', 'Props', '$q', '_', function ($resource, Props, $q, _) {


        var hae =  $resource(Props.organisaatioService + '/rest/organisaatio/:_oid',
            { _oid: '@_oid'},
            {}
        );
        var organisaatio = {},
            _organisation = {},
            _selectedOrganisation = {},
            _userOrganisations = [];

        organisaatio.setOrganisation = function (organization) {
            _organisation = organization;
        };

        organisaatio.getOrganisation = function () {
            return _organisation;
        };
        /**
         * Tallennetaan käyttäjän valitsema organisaatio muutujaan
         * talteen
         * @param selectedOrganisation käyttäjän valitsema organisaatio
         */
        organisaatio.setUserSelectedOrganisation = function (selectedOrganisation) {
            _selectedOrganisation = selectedOrganisation;
        };
        /**
         * Palautaa käytäjän valitseman organisaation muuttujasta
         * @returns {{}} käyttäjän valitsema organisaatio
         */
        organisaatio.getUserSelectedOrganisation = function () {
            return _selectedOrganisation;
        };
        /**
         * Palautaa organisaation id:llä, jos organisaatio ei ole muistissa
         * tehdään uudelleen haku organisaation palveluun organisaation oid:lla
         * @param oid: organisaation id
         * @returns {promise}: palauttaa organisaation
         */

        organisaatio.fetchOrganisation = function (oid) {
            var deferred = $q.defer();
            if (_organisation !== undefined && _organisation.oid !== undefined) {
                if (_organisation.oid === oid) {
                    deferred.resolve(_organisation);
                }
            }
            hae.get({'_oid': oid}).$promise.then(
                function (data) {
                    organisaatio.setOrganisation(data);
                    deferred.resolve(data);
                }
            );
            return deferred.promise;
        };
        /**
         * Hakee organisaatioon liittyvän datan
         * @param oid organisaation id
         * @returns {promise}
         */
        organisaatio.getOrganisationData = function (oid) {
            var deferred = $q.defer();
            hae.get({'_oid': oid}).$promise.then(
                function (data) {
                    deferred.resolve(data);
                }
            );
            return deferred.promise;
        };
        /**
         * Hakee käyttäjän organisaatiot
         * @returns {promise}
         */
        organisaatio.getUserOrganisations = function () {
            var deferred = $q.defer();

            if (_userOrganisations.length > 0) {
                deferred.resolve(_userOrganisations);
            } else {
                //$resource(Props.authService + '/resources/omattiedot/organisaatiohenkilo').query().$promise.then(
        $.getJSON(Props.contextRoot + '/app/test-data/organisaatiohenkilo.json',
                    function (data) {
                        var userOrganisations = _.map(_.filter(data, function (activeOrg) { if (!activeOrg.passivoitu) { return activeOrg; } }), function (userOrgs) { return userOrgs.organisaatioOid; }),
                            getUserOrgs = [];

                        _.each(userOrganisations, function (oid) {
                                getUserOrgs.push(hae.get({'_oid': oid}).$promise);
                            }
                        );

                        $q.all(getUserOrgs).then(
                            function (data) {
                                var orgs = [];
                                _.each(data, function (orgInfo) {
                                        var org = {};
                                        if (orgInfo.nimi) {
                                            if (orgInfo.nimi.fi) {
                                                orgInfo.nimi.fi = orgInfo.nimi.fi + ' (' + orgInfo.tyypit[0] + ')';
                                            }
                                            if (orgInfo.nimi.sv) {
                                                orgInfo.nimi.sv = orgInfo.nimi.sv + ' (' + orgInfo.tyypit[0] + ')';
                                            }
                                            if (orgInfo.nimi.en) {
                                                orgInfo.nimi.en = orgInfo.nimi.en + ' (' + orgInfo.tyypit[0] + ')';
                                            }
                                        }

                                        org.nimi = orgInfo.nimi;
                                        org.oid = orgInfo.oid;
                                        orgs.push(org);
                                    }
                                );
                                //asetetaan käyttäjän organisaatio muistiin
                                _userOrganisations = orgs;
                                deferred.resolve(orgs);
                            }
                        );
                    }
                );
            }
            return deferred.promise;
        };
        /**
         * Haetaan organisaatio palvelusta rajaavat hakukohde ryhmät
         * @params organisationOid käyttäjän organisaatio oid
         * @returns {promise}
         */
        organisaatio.getRajaavatHakukohdeRyhmat = function (organisationOid) {
            console.log('getRajaavatHakukohdeRyhmat() --->', organisationOid);
            var deferred = $q.defer();
            $resource(Props.organisaatioService + '/rest/organisaatio/' + organisationOid + '/ryhmat').query().$promise.then(
                function (data) {
                    var hakukohde_rajaava = _.filter(data, function (rajaava) { return _.contains(rajaava.kayttoryhmat, 'hakukohde_rajaava')
                        && _.contains(rajaava.ryhmatyypit, 'hakukohde'); });
                    deferred.resolve(hakukohde_rajaava);
                }
            );
            return deferred.promise;
        };
        /**
         * Haetaan organisaatio palvelusta priorisoivat hakukohde ryhmät
         * @params organisationOid käyttäjän organisaatio oid
         * @returns {promise}
         */
        organisaatio.getPriorisoivatHakukohdeRyhmat = function (organisationOid) {
            console.log('getPriorisoivatHakukohdeRyhmat() --->');
            var deferred = $q.defer();
            $resource(Props.organisaatioService + '/rest/organisaatio/' + organisationOid +'/ryhmat').query().$promise.then(
                function (data) {
                    var hakukohde_rajaava = _.filter(data, function (rajaava) { return _.contains(rajaava.kayttoryhmat, 'hakukohde_priorisoiva')
                        && _.contains(rajaava.ryhmatyypit, 'hakukohde'); });
                    deferred.resolve(hakukohde_rajaava);
                }
            );
            return deferred.promise;
        };


        return organisaatio;
    }]);


