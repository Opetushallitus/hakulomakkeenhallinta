'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.service')
  .service('HH',  ['$http', 'FormWalker', '_', 'Props',
        function($http, FormWalker, _, Props ) {
        console.log('****** HH ******');
        //var applicationSystems = ASForms.query();
        var _applicationsSystemForm;
        var _organization = {};
/*
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
        };*/
        this.setApplicationSystemForm = function(applicationSystemForm){
            _applicationsSystemForm = applicationSystemForm;
        };

         this.getApplicationSystemForm = function(){
            return _applicationsSystemForm;
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
                    applicationOptions.push(org);
                });
            });
            return applicationOptions;
        };

    }]);
