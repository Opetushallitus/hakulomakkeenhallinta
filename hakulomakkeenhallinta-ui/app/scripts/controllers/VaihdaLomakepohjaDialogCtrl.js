'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('vaihdaLomakepohjaDialogCtrl', ['$rootScope', '$scope', 'ApplicationFormConfiguration', '$modalInstance', 'applicationForm', 'lomakepohjat', 'AlertMsg', '$routeParams', '$location', '_',
        function ($rootScope, $scope, ApplicationFormConfiguration, $modalInstance, applicationForm, lomakepohjat, AlertMsg, $routeParams, $location, _) {
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
            $scope.valitseOletuspohja = function () {
                ApplicationFormConfiguration.haeDefaultLomakepohja($routeParams.id).then(
                    function (oletusPohja) {
                        $scope.lomakepohja = _.findWhere($scope.lomakepohjat, { id: oletusPohja});
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