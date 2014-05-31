'use strict';
angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('SelectHakukohdeCtrl', ['$scope', '$location', '$modalInstance', 'HH', 'QuestionData',
        function($scope, $location, $modalInstance, HH, QuestionData ) {
            $scope.applicationOptions = [];
            $scope.applicationSystemForm = HH.getApplicationSystemForm();

            $scope.applicationOptions = HH.usersApplicationOptions($scope.applicationSystemForm._id, HH.getOrganisation().oid);
            
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

