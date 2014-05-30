'use strict';
angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('SelectHakukohdeCtrl', ['$scope', '$location', '$modalInstance', 'HH', 'QuestionData', 'OrganisaatioHenkilo',
        function($scope, $location, $modalInstance, HH, QuestionData, OrganisaatioHenkilo ) {
             $scope.applicationOptions = [];
//             $scope.queryParameters = {};
             $scope.applicationSystemForm = HH.getApplicationSystemForm();
             $scope.organisations = [];

//            OrganisaatioHenkilo.get().$promise.then(function(data){
//                var userOrganizations = [];
//                for(var org  in data.organisaatiot){
//                    var organisation = {};
//                    organisation.oid = data.organisaatiot[org].oid;
//                    organisation.nimi = data.organisaatiot[org].nimi;
//                    userOrganizations.push(organisation);
//                }
//                $scope.organisations = userOrganizations;
//                if($scope.organisations.length == 1){
//                    HH.setOrganization($scope.organisations[0]);
//                    $scope.applicationOptions = HH.usersApplicationOptions($scope.applicationSystemForm._id, $scope.organisations[0].oid);
//                }
//            });

            $scope.applicationOptions = HH.usersApplicationOptions($scope.applicationSystemForm._id, HH.getOrganization().oid);
            console.log('####', $scope.applicationOptions);
            $scope.jatka = function(hakukohde) {
             console.log('-- jatka -- ',hakukohde);
             QuestionData.setApplicationOption(hakukohde);
             $modalInstance.close(hakukohde.oid);
             };

             $scope.cancel = function() {
             $modalInstance.dismiss('cancel');
             };

        }]);

