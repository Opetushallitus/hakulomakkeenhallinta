'use strict';

angular.module('services.service')
  .service('HH',  ['$http', 'ASFResource', 'FormWalker', '_', function($http, ASFResource, FormWalker, _) {
        var applicationSystems = ASFResource.query();

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
            return {
                'i18nText': {
                    'translations': {
                        'fi': 'k-kauppa'
                    }
                }
            };
        };

        this.searchApplicationOptions = function(asid, term) {
            var applicationOptions = [];
            $http.get("https://itest-virkailija.oph.ware.fi:443/tarjonta-service/rest/v1/hakukohde/search", {
                //$http.get("https://virkailija.opintopolku.fi/tarjonta-service/rest/v1/hakukohde/search", {
                params: {
                    searchTerms: term
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
