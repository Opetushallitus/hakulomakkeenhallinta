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
            var defferred = $q.defer();
            if (_organisation !== undefined && _organisation.oid !== undefined) {
                if (_organisation.oid === oid) {
                    defferred.resolve(_organisation);
                }
            }
            hae.get({'_oid': oid}).$promise.then(
                function (data) {
                    organisaatio.setOrganisation(data);
                    defferred.resolve(data);
                }
            );
            return defferred.promise;
        };
        /**
         * Hakee organisaatioon liittyvän datan
         * @param oid organisaation id
         * @returns {promise}
         */
        organisaatio.getOrganisationData = function (oid) {
            var defferred = $q.defer();
            hae.get({'_oid': oid}).$promise.then(
                function (data) {
                    defferred.resolve(data);
                }
            );
            return defferred.promise;
        };
        /**
         * Hakee käyttjän organisaatiot
         * @returns {promise}
         */
        organisaatio.getUserOrganisations = function () {
            var defferred = $q.defer();

            if (_userOrganisations.length > 0) {
                defferred.resolve(_userOrganisations);
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
                                defferred.resolve(orgs);
                            }
                        );
                    }
                );
            }
            return defferred.promise;
        }

        return organisaatio;
    }]);


