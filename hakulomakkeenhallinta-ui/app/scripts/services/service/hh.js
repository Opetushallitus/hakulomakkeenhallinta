'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.service')
  .service('HH',  ['$http', 'ASForms', 'FormWalker', '_', 'Props',
        function($http, ASForms, FormWalker, _, Props ) {

        var applicationSystems = ASForms.query();

        this.listApplicationSystems = function() {
            return applicationSystems;
        };
        this.find = function(applicationSystem, predicate) {
            return FormWalker.find(applicationSystem.form, predicate);
        };
        this.getApplicationSystem = function(id) {
            return _.find(applicationSystems, function(as) {
                return as._id === id;
            });
        };

        this.getOrganization = function() {
            //TODO: tälle pitää tehdä joitain missä tämä tulee? Käyttäjän tiedoista?
            return {
                'i18nText': {
                    'translations': {
                        'fi': 'k-kauppa'
                    }
                }
            };
        };

        this.searchApplicationOptions = function(userOrgizations, term) {
            var applicationOptions = [];
            $http.get("https://itest-virkailija.oph.ware.fi:443/tarjonta-service/rest/v1/hakukohde/search", {
                params: {
                    searchTerms: term,
                    organisationOid: userOrgizations
                }
            }).success(function(data) {
                _.each(data.result.tulokset, function(org) {
                    _.each(org.tulokset, function(ao) {
                        applicationOptions.push(ao);
                    });
                });
            });
            return applicationOptions;
        };

        this.usersApplicationOptions = function(userOrganisations) {
            var applicationOptions = [];
            $http.get("https://itest-virkailija.oph.ware.fi:443/tarjonta-service/rest/v1/hakukohde/search", {
                params: {
                    organisationOid: userOrganisations
                }
            }).success(function(data) {
                _.each(data.result.tulokset, function(org) {
                    _.each(org.tulokset, function(ao) {
                        applicationOptions.push(ao);
                    });
                });
            });
            return applicationOptions;
        };

    }]);
