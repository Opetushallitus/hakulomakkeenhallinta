'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.service')
  .service('HH',  ['$http', 'ASForms', 'FormWalker', '_', 'Props',
        function($http, ASForms, FormWalker, _, Props ) {
        console.log('****** HH ******');
        //var applicationSystems = ASForms.query();
        var _organization = {};

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

        this.setOrganization = function(organization){
            _organization = organization;
        };

        this.getOrganization = function() {
            return _organization;
        };

        this.usersApplicationOptions = function(hakuOid, userOrganisations ) {
            var applicationOptions = [];
            console.log('haku oid:',hakuOid);
            console.log('organisaatio: ',userOrganisations);
            $http.get(Props.tarjontaAPI+"/hakukohde/search", {
                params: {
                    organisationOid: userOrganisations,
                    hakuOid: hakuOid
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
