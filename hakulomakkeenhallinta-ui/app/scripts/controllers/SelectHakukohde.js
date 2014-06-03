'use strict';
angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('SelectHakukohdeCtrl', ['$scope', '$rootScope', '$location', '$modalInstance', 'HH', 'QuestionData','$routeParams',
        function($scope, $rootScope, $location, $modalInstance, HH, QuestionData, $routeParams ) {
            $rootScope.LOGS('SelectHakukohdeCtrl ',5 );
            $scope.applicationOptions = [];

            $scope.applicationOptions = HH.usersApplicationOptions($routeParams.id, $routeParams.oid);

            $rootScope.LOGS('SelectHakukohdeCtrl ',10, $scope.applicationOptions);
            $scope.jatka = function(hakukohde) {
                $rootScope.LOGS('SelectHakukohdeCtrl ',12,' jatka ',hakukohde);
                QuestionData.setApplicationOption(hakukohde);
                $modalInstance.close(hakukohde.oid);
            };

            $scope.cancel = function() {
                $modalInstance.dismiss('cancel');
            };

        }]);

