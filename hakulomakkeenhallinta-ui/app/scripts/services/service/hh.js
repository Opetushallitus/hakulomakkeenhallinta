'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.service')
  .service('HH',  ['$http', '$rootScope', 'FormWalker', '_', 'Props',  'Organisaatio', '$q', 'FormEditor',
        function($http, $rootScope, FormWalker, _, Props, Organisaatio, $q, FormEditor ) {
        $rootScope.LOGS('HH '+ 6);
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
            $rootScope.LOGS('HH '+ 28 +' haku oid:'+hakuOid);
            $rootScope.LOGS('HH '+29+' organisaatio: '+userOrganisations);
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
             if(_organisation != undefined && _organisation.oid != undefined){
                 if( _organisation.oid == oid){
                     defferred.resolve(_organisation);
                 }
             }
             Organisaatio.get({'_oid':oid}).$promise.then(
                 function(data){
                     defferred.resolve(data);
                 });
             return defferred.promise;
        };

        this.fetchApplicationSystemForm = function(id){
            var deffered = $q.defer();
            $rootScope.LOGS('HH '+ 59+' fetchApplicationSystemForm haku oid: '+ id);
            $rootScope.LOGS('HH '+ 60+'_applicationsSystemForm: '+ _applicationsSystemForm);
            if(_applicationsSystemForm != undefined &&_applicationsSystemForm._id != undefined ){
                if( _applicationsSystemForm._id == id){
                    deffered.resolve(_applicationsSystemForm);
                }
            }
            FormEditor.get({'_path':'application-system-form', '_id':id,'_oper':'name'}).$promise.then(
                function(data){
                $rootScope.LOGS('HH '+ 68+ data);
                deffered.resolve(data);
            });

            return deffered.promise;
        };

        this.fetchHakukohdeInfo = function(hakuOid) {
            var deffered = $q.defer();
            $rootScope.LOGS('HH fetchHakukohdeInfo haku oid:',hakuOid);
            $http.get(Props.tarjontaAPI+"/hakukohde/"+hakuOid).success(
                function(data) {
                    if(data.result){
                        $rootScope.LOGS('HH '+ data.result.hakukohteenNimi);
                        deffered.resolve(data.result.hakukohteenNimi);
                    }
                });

            return deffered.promise;
        };

    }]);
