'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('SelectOrganisationCtrl', ['$scope', '$rootScope', '$location', '$modalInstance', 'applicationSystemForm', 'HH', 'FormEditor', '$timeout',
        function($scope, $rootScope, $location, $modalInstance, applicationSystemForm, HH, FormEditor, $timeout ) {

            $rootScope.LOGS('SelectOrganisationCtrl ', 1);

            $scope.applicationOptions = [];
            $scope.applicationSystemForm = applicationSystemForm;
            $scope.organisations = [];
            $scope.$emit('LOAD');
            $rootScope.LOGS('SelectOrganisationCtrl ', 2,'loading value:'+$scope.loading);
            FormEditor.query({'_path':'application-system-form','_id': applicationSystemForm._id, '_oper':'represented-organizations'}).$promise.then(
                function(data){
                    $rootScope.LOGS('SelectOrganisationCtrl ', 3, data);
                    $scope.$emit('LOADREADY');
                    $scope.organisations = data;

            });

            $timeout(function(){
                console.log('LOADREADY after timeout');
                $scope.$emit('LOADREADY');
            }, 5000);

            $scope.selectedOrganisation = function(){
                if(this.organisation !==null){
                    $rootScope.LOGS('SelectOrganisationCtrl ',4 , this.organisation);
                    HH.setOrganisation(this.organisation);
                    $scope.applicationOptions = HH.usersApplicationOptions(applicationSystemForm._id, this.organisation.id);
                }
            };

            $scope.jatka = function() {
                $rootScope.LOGS('SelectOrganisationCtrl ', 5, ' jatka ', HH.getOrganisation().id);
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
