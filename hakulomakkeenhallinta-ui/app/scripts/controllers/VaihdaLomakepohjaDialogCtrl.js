'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('vaihdaLomakepohjaDialogCtrl', ['$rootScope', '$scope', 'ApplicationFormConfiguration', '$modalInstance', 'applicationForm', 'lomakepohjat', 'AlertMsg', '$routeParams', '$location',
        function ($rootScope, $scope, ApplicationFormConfiguration, $modalInstance, applicationForm, lomakepohjat, AlertMsg, $routeParams, $location) {
            $rootScope.LOGS('vaihdaLomakepohjaDialogCtrl');

            $scope.lomakepohjat = lomakepohjat;
            $scope.applicationForm = applicationForm;
            $scope.lomakepohja = {};
            $scope.lomakepohja = '';

            $scope.vaihdaLomakepohja = function () {
                ApplicationFormConfiguration.vaihdaHaunLomakepohja($routeParams.id, $scope.lomakepohja.id).then(
                    function success (data) {
                        $modalInstance.close();
                        $location.path('/applicationSystemFormConfigurations/' + $routeParams.id + '/' + $routeParams.oid);
                    },
                    function error (resp) {
                        $rootScope.LOGS('vaihdaLomakepohjaDialogCtrl', 'vaihdaLomakepohja()', resp.statusText, resp.status);
                        AlertMsg($scope, 'warning', 'error.tallennus.epaonnistui');
                    }
                );
            };
            /**
             * Suljetaan dialogi
             */
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

        }]);