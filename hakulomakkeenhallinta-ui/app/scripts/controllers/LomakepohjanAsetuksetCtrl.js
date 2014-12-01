'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('lomakepohjanAsetuksetCtrl', ['$rootScope', '$scope', 'TarjontaAPI', 'Organisaatio', 'AlertMsg', '$routeParams', 'FormEditor',
        function ($rootScope, $scope, TarjontaAPI, Organisaatio, AlertMsg, $routeParams, FormEditor) {
            $rootScope.LOGS('lomakepohjanAsetuksetCtrl');

            $scope.hakukohdeRyhmat = [];
            $scope.applicationForm = {};
            $scope.naytaRyhmat = false;

            /**
             * haetaan valitun hakulomakkeen tiedot hakulomakkeen Id:llä
             */
            FormEditor.fetchApplicationSystemForm($routeParams.id).then(
                function (data) {
                    $scope.applicationForm = data;
                }
            );

            $scope.$emit('LOAD');
            TarjontaAPI.usersApplicationOptionGroups($routeParams.id, Organisaatio.getUserSelectedOrganisation().oid).then(
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

        }]);