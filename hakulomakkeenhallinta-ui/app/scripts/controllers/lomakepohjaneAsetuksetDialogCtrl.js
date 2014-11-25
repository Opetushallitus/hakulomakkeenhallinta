'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('lomakepohjanAsetuksetDialogCtrl', [ '$rootScope', '$scope', '$modalInstance', 'TarjontaAPI', 'applicationForm', 'Organisaatio',
        function ($rootScope, $scope, $modalInstance, TarjontaAPI, applicationForm, Organisaatio) {
        $rootScope.LOGS('lomakepohjanAsetuksetDialogCtrl');

            $scope.hakukohdeRyhmat = [];
            $scope.applicationForm = applicationForm;
            $scope.naytaRyhmat = false;
            $scope.$emit('LOAD');
            TarjontaAPI.usersApplicationOptionGroups($scope.applicationForm._id, Organisaatio.getUserSelectedOrganisation().oid).then(
                function (data) {
                    $scope.$emit('LOADREADY');
                    $scope.hakukohdeRyhmat = data;
                }
            );

            $scope.toggleNaytaHakukohderyhmat = function () {
                $scope.naytaRyhmat = !$scope.naytaRyhmat;
            };

            /**
             * Suljetaan dialogi
             */
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

    }]);
