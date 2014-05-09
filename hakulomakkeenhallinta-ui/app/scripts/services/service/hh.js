'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.service')
  .service('HH',  ['$http', 'ASForms', 'FormWalker', '_', 'Props', function($http, ASForms, FormWalker, _, Props) {
        var applicationSystems = [];
        ASForms.query().$promise.then(
            function success(data){
                console.log('HH service');
                applicationSystems = data;
            },function error(error){
                //TODO: tämän käsittely
                console.log(error.data.message, error.status);
            });

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

        this.searchApplicationOptions = function(asid, term) {
            var applicationOptions = [];
//            $http.get(Props.tarjontaAPI+'/hakukohde/search', {
            $http.get("https://itest-virkailija.oph.ware.fi:443/tarjonta-service/rest/v1/hakukohde/search", {
                //$http.get("https://virkailija.opintopolku.fi/tarjonta-service/rest/v1/hakukohde/search", {
                params: {
                    searchTerms: term
                }
            }).success(function(data) {
                console.log('9999999');
                _.each(data.result.tulokset, function(org) {
                    _.each(org.tulokset, function(ao) {
                        applicationOptions.push(ao);
                    });
                });
            }).error(function(error){
                //TODO: tämän käsittely
                console.log('HH searchApplicationOptions ERROR');
                console.log(error);
            });
            return applicationOptions;
        };

    }]);
