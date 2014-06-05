'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('SelectOrganisationCtrl', ['$scope', '$rootScope', '$location', '$modalInstance', 'applicationSystemForm', 'HH', 'FormEditor',
        function($scope, $rootScope, $location, $modalInstance, applicationSystemForm, HH, FormEditor ) {

            $rootScope.LOGS('SelectOrganisationCtrl ', 7);

            $scope.applicationOptions = [];
            $scope.applicationSystemForm = applicationSystemForm;
            $scope.organisations = [];
            $scope.$emit('LOAD');
            $rootScope.LOGS('SelectOrganisationCtrl ', 12,'loading value:'+$scope.loading);
            FormEditor.query({'_path':'application-system-form','_id': applicationSystemForm._id, '_oper':'represented-organizations'}).$promise.then(
                function(data){
                    $rootScope.LOGS('SelectOrganisationCtrl ', 15, data);
                    $scope.organisations = data;
                    $scope.$emit('LOADREADY');
            });

            $scope.selectedOrganisation = function(){
                if(this.organisation !==null){
                    $rootScope.LOGS('SelectOrganisationCtrl ', 15, this.organisation);
                    HH.setOrganisation(this.organisation);
                    $scope.applicationOptions = HH.usersApplicationOptions(applicationSystemForm._id, this.organisation.id);
                }
            };

            $scope.jatka = function() {
                $rootScope.LOGS('SelectOrganisationCtrl ', 34, ' jatka ', HH.getOrganisation().id);
                if(HH.getOrganisation().id !== undefined){
                    HH.setApplicationSystemForm(applicationSystemForm);
                    $modalInstance.dismiss('ok');
                    $location.path("/themeQuestionsByOrganisation/" + $scope.applicationSystemForm._id+'/'+HH.getOrganisation().id );
                }
            };

            $scope.cancel = function() {
                $modalInstance.dismiss('cancel');
            };

}]);
