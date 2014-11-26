'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('lomakepohjanAsetuksetDialogCtrl', [ '$rootScope', '$scope', '$modalInstance', 'TarjontaAPI', 'applicationForm', 'Organisaatio', 'AlertMsg',
        function ($rootScope, $scope, $modalInstance, TarjontaAPI, applicationForm, Organisaatio, AlertMsg) {
        $rootScope.LOGS('lomakepohjanAsetuksetDialogCtrl');

            $scope.hakukohdeRyhmat = [];
            $scope.applicationForm = applicationForm;
            $scope.naytaRyhmat = false;
            $scope.$emit('LOAD');
            TarjontaAPI.usersApplicationOptionGroups($scope.applicationForm._id, Organisaatio.getUserSelectedOrganisation().oid).then(
                function (data) {
                    $scope.$emit('LOADREADY');
                    $scope.hakukohdeRyhmat = data;
                    if ($scope.hakukohdeRyhmat.length === 0) {
                        AlertMsg($scope, 'warning', 'valitulla.organisaatiolla.ei.tassa.hakulomakkeella.ole.hakukohderyhmia');
                    }
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
