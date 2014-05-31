'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.service')
  .service('HH',  ['$http', 'FormWalker', '_', 'Props',  'Organisaatio', '$q',
        function($http, FormWalker, _, Props, Organisaatio, $q ) {
        console.log('****** HH ******');
        var _applicationsSystemForm;
        var _organisation = {};

        this.setApplicationSystemForm = function(applicationSystemForm){
            _applicationsSystemForm = applicationSystemForm;
        };

         this.getApplicationSystemForm = function(){
            return _applicationsSystemForm;
         };

        this.setOrganisation = function(organisation){
            _organisation = organisation;
        };

        this.getOrganisation = function() {
            return _organisation;
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

         this.fetchOrganisation = function(oid){
            var defferred = $q.defer();
            if(_organisation.oid != undefined && _organisation.oid == oid){
               defferred.resolve(_organisation);
            }
             Organisaatio.get({'_oid':oid}).$promise.then(
                 function(data){
                     defferred.resolve(data);
                 });
             return defferred.promise;
        };

    }]);
