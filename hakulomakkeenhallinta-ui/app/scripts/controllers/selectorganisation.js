'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('SelectOrganisationCtrl', ['$scope', '$location', '$modalInstance', 'applicationSystemForm', 'HH', 'OrganisaatioHenkilo',
        function($scope, $location, $modalInstance, applicationSystemForm, HH, OrganisaatioHenkilo ) {
            console.log('**** SelectOrganisationCtrl ****');
            $scope.applicationOptions = [];
            $scope.applicationSystemForm = applicationSystemForm;
            $scope.organisations = [];

            OrganisaatioHenkilo.get().$promise.then(function(data){
                var userOrganisations = [];
                for(var org  in data.organisaatiot){
                    var organisation = {};
                    organisation.oid = data.organisaatiot[org].oid;
                    organisation.nimi = data.organisaatiot[org].nimi;
                    userOrganisations.push(organisation);
                }
                $scope.organisations = userOrganisations;
                if($scope.organisations.length == 1){
                    HH.setOrganisation($scope.organisations[0]);
                    $scope.applicationOptions = HH.usersApplicationOptions($scope.applicationSystemForm._id, $scope.organisations[0].oid);
                }
            });

            $scope.selectedOrganisation = function(){
                var org = [];
                if(this.organisation !==null){
                    org.push(this.organisation.oid);
                    HH.setOrganisation(this.organisation);
                    $scope.applicationOptions = HH.usersApplicationOptions($scope.applicationSystemForm._id, org);
                }
            };

            $scope.jatka = function() {
                console.log('-- jatka -- ', HH.getOrganisation().oid);
                if(HH.getOrganisation().oid !== undefined){
                    HH.setApplicationSystemForm(applicationSystemForm);
                    $modalInstance.dismiss('ok');
                    $location.path("/themeQuestionsByOrganisation/" + $scope.applicationSystemForm._id+'/'+HH.getOrganisation().oid );
                }
            };

            $scope.cancel = function() {
                $modalInstance.dismiss('cancel');
            };

}]);
