'use strict';
angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('SelectHakukohdeCtrl', ['$scope', '$rootScope', '$location', '$modalInstance', 'HH', 'QuestionData',
        function($scope, $rootScope, $location, $modalInstance, HH, QuestionData ) {
            $scope.applicationOptions = [];
            $scope.applicationSystemForm = HH.getApplicationSystemForm();

            $scope.applicationOptions = HH.usersApplicationOptions($scope.applicationSystemForm._id, HH.getOrganisation().oid);

            $rootScope.LOGS('SelectHakukohdeCtrl '+10+' '+ $scope.applicationOptions);
            $scope.jatka = function(hakukohde) {
                $rootScope.LOGS('SelectHakukohdeCtrl '+12+' jatka '+hakukohde);
                QuestionData.setApplicationOption(hakukohde);
                $modalInstance.close(hakukohde.oid);
            };

            $scope.cancel = function() {
                $modalInstance.dismiss('cancel');
            };

        }]);

