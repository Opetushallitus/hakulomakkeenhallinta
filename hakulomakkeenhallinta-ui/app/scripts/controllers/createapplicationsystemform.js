'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('CreateapplicationsystemformCtrl',
        function($scope, $modalInstance, ApplicationSystemResource,TarjontaAPI, Mallipohjat, ASForms) {
            $scope.applicationSystems = [];
            $scope.applicationFormTemplates = [];

            //heataan tarjonnasta meneillään olevat haut
            TarjontaAPI.query().$promise.then(function success(data){
                $scope.applicationSystems = data;
            }, function error(error){
                //TODO: tämän käsittely
                console.log(error);
            });
            //Heataan mallipohjat, jotka liitetään hakuun??
            Mallipohjat.query().$promise.then(function success(data){
                $scope.applicationFormTemplates = data;
            }, function error(error){
                //TODO: tämän käsittely
                console.log(error);
            });

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
