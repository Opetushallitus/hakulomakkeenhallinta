'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')

.controller('ModalApplicationOptionCtrl', ['$scope', '$location', '$modalInstance', 'applicationSystemForm', 'HH', 'QuestionData', 'OrganisaatioHenkilo',
    function($scope, $location, $modalInstance, applicationSystemForm, HH, QuestionData, OrganisaatioHenkilo ) {
        $scope.applicationOptions = [];
        $scope.queryParameters = {};
        $scope.applicationSystemForm = applicationSystemForm;
        $scope.userOrganizations = [];

        OrganisaatioHenkilo.get().$promise.then(function(organisaatiot){
            console.log('#### käyttäjän organisaatiot: ',organisaatiot);
            for(var org  in organisaatiot){
                $scope.userOrganizations.push(organisaatiot[org].oid);
            }
            $scope.applicationOptions = HH.usersApplicationOptions($scope.userOrganizations);
        });

        //TODO: tämä localhost hack poista!!
        var orgs = ["1.2.246.562.10.82388989657", "1.2.246.562.10.65530732232" ];
        $scope.applicationOptions = HH.usersApplicationOptions(orgs);

        $scope.ok = function() {
            QuestionData.setApplicationOption(this.applicationOption);
            $modalInstance.close(this.applicationOption.oid);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
        $scope.search = function() {
//            $scope.applicationOptions = HH.searchApplicationOptions(applicationSystemForm._id, $scope.queryParameters.term);
            $scope.applicationOptions = HH.searchApplicationOptions($scope.userOrganizations, $scope.queryParameters.term);
        };
    }
]);
