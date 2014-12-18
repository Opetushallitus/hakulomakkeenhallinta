'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('vaihdaLomakepohjaDialogCtrl', ['$rootScope', '$scope', 'ApplicationFormConfiguration', '$modalInstance', 'applicationForm', 'lomakepohjat', 'AlertMsg', '$routeParams',  '_',
        function ($rootScope, $scope, ApplicationFormConfiguration, $modalInstance, applicationForm, lomakepohjat, AlertMsg, $routeParams, _) {
            $rootScope.LOGS('vaihdaLomakepohjaDialogCtrl');

            $scope.lomakepohjat = lomakepohjat;
            $scope.applicationForm = applicationForm;
            $scope.lomakepohja = {};
            $scope.lomakepohja = '';
            /**
             * vaihdetaan haun lomake pohjaa sen asetuksiin
             */
            //TODO: tarkista tämä kun back end toimii oikein
            $scope.vaihdaLomakepohja = function () {
                ApplicationFormConfiguration.vaihdaHaunLomakepohja($routeParams.id, $scope.lomakepohja.id).then(
                    function success (data) {
                        $modalInstance.close();
                    },
                    function error (resp) {
                        $rootScope.LOGS('vaihdaLomakepohjaDialogCtrl', 'vaihdaLomakepohja()', resp.statusText, resp.status);
                        AlertMsg($scope, 'warning', 'error.tallennus.epaonnistui');
                    }
                );
            };
            /**
             * Haetaan taustajärjestelmästä oletus lomake pohja
             * haulle, jos se on saatavilla
             */
            //TODO: tarkista tämä kun back end toimii oikein
            $scope.valitseOletuspohja = function () {
                ApplicationFormConfiguration.haeDefaultLomakepohja($routeParams.id).then(
                    function (oletusPohja) {
                        console.log(_.findWhere($scope.lomakepohjat, { id: oletusPohja}));
                        if (_.findWhere($scope.lomakepohjat, { id: oletusPohja}) === undefined) {
                            AlertMsg($scope, 'warning', 'warning.oletuspohja.kaytossa');
                        } else {
                            $scope.lomakepohja = _.findWhere($scope.lomakepohjat, { id: oletusPohja});
                        }

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