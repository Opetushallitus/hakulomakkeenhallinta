'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('CreateapplicationsystemformCtrl',
        function($scope, $modalInstance, ASFResource, FormResource, ApplicationSystemResource) {
            $scope.applicationSystems = ApplicationSystemResource.query();
            $scope.applicationFormTemplates = FormResource.query();
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
