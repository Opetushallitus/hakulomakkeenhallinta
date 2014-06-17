'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('CreateapplicationsystemformCtrl',
        function($scope, $rootScope, $modalInstance, ApplicationSystemResource,TarjontaAPI, Mallipohjat, ASForms) {
            $rootScope.LOGS('CreateapplicationsystemformCtrl');
            //heataan tarjonnasta meneillään olevat haut
            $scope.applicationSystems = TarjontaAPI.query();
            //Heataan mallipohjat, jotka liitetään hakuun??
            $scope.applicationFormTemplates = Mallipohjat.query();

            $scope.ok = function() {
                var applicationSystemForm = {
                    applicationFormTemplate: this.applicationFormTemplate,
                    applicationSystem: this.applicationSystem
                };
                ASForms.update( applicationSystemForm, function success(resp){
                    //TODO: tämän käsittely
                    $rootScope.LOGS('CreateapplicationsystemformCtrl ',resp);
                    $modalInstance.close(applicationSystemForm);
                },function error(error){
                    //TODO: tämän käsittely
                    $rootScope.LOGS('CreateapplicationsystemformCtrl ','Haun ja hakemuksen liittäminen ei onnistu');
                    $rootScope.LOGS('CreateapplicationsystemformCtrl ',error);
                });

            };

            $scope.cancel = function() {
                $modalInstance.dismiss('cancel');
            };
        });
