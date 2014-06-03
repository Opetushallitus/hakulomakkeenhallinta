'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('SelectOrganisationCtrl', ['$scope', '$rootScope', '$location', '$modalInstance', 'applicationSystemForm', 'HH', 'FormEditor',
        function($scope, $rootScope, $location, $modalInstance, applicationSystemForm, HH, FormEditor ) {

            $rootScope.LOGS('SelectOrganisationCtrl ', 7);

            $scope.applicationOptions = [];
            $scope.applicationSystemForm = applicationSystemForm;
            $scope.organisations = [];

            FormEditor.get({'_path':'application-system-form','_id': $scope.applicationSystemForm._id, '_oper':'represented-organizations'}).$promise.then(
                function(data){
                $scope.organisations = data;
            });

            $scope.selectedOrganisation = function(){
                var org = [];
                if(this.organisation !==null){
                    org.push(this.organisation.id);
                    HH.setOrganisation(this.organisation);
                    $scope.applicationOptions = HH.usersApplicationOptions($scope.applicationSystemForm._id, this.organisation.id);
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
