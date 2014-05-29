'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('CreateapplicationsystemformCtrl',
        function($scope, $modalInstance, ApplicationSystemResource,TarjontaAPI, Mallipohjat, ASForms) {
            console.log('****** CreateapplicationsystemformCtrl *****');
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
                    console.log(resp);
                    $modalInstance.close(applicationSystemForm);
                },function error(error){
                    //TODO: tämän käsittely
                    console.log('Haun ja hakemuksen liittäminen ei onnistu');
                    console.log(error);
                });

            };

            $scope.cancel = function() {
                $modalInstance.dismiss('cancel');
            };
        });
