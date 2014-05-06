'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('CreateapplicationsystemformCtrl',
        function($scope, $modalInstance, ASFResource, FormResource, ApplicationSystemResource,TarjontaAPI, Mallipohjat) {
            $scope.applicationSystems = [];
            $scope.applicationFormTemplates = [];

            //heataan tarjonnasta meneillään olevat haut
            TarjontaAPI.tarjontaHaeKaikki.query().$promise.then(function(data){
                $scope.applicationSystems = data;
            });

            Mallipohjat.haeMallipohjat.get().$promise.then(function(data){
                $scope.applicationFormTemplates = data;
            });

            $scope.ok = function() {
                var applicationSystemForm = {
                    applicationFormTemplate: this.applicationFormTemplate,
                    applicationSystem: this.applicationSystem
                };
                $modalInstance.close(applicationSystemForm);
            };

            $scope.cancel = function() {
                $modalInstance.dismiss('cancel');
            };
        });
