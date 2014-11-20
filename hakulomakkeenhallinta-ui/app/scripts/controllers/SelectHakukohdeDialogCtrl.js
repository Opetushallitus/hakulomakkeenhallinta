'use strict';
angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('SelectHakukohdeDialogCtrl', ['$scope', '$rootScope', '$location', '$modalInstance', 'TarjontaAPI', 'QuestionData','$routeParams', 'applicationSystem', 'FormEditor', 'AlertMsg', 'theme', '$filter',
        function($scope, $rootScope, $location, $modalInstance, TarjontaAPI, QuestionData, $routeParams, applicationSystem, FormEditor, AlertMsg, theme, $filter ) {
            $rootScope.LOGS('SelectHakukohdeDialogCtrl ');
            $scope.applicationOptions = [];
            $scope.$emit('LOAD');
            $scope.applicationSystem = applicationSystem;
            $scope.theme =  theme;
            $scope.haunNimi = $filter('i18n')(applicationSystem, 'name', $scope.userLang);
            $scope.teema = $filter('i18n')(theme, 'name', $scope.userLang);

            if (applicationSystem === undefined) {
                /**
                 * haetaan valitun hakulomakkeen tiedot hakulomakkeen Id:llä
                 */
                FormEditor.fetchApplicationSystemForm($routeParams.id).then(
                    function (data) {
                        $scope.applicationSystem = data;
                    }
                );
            };
            /**
             * Haetaa hakulomakkeeseen ja käyttäjän organisaation liittyvät hakukohteet
             */
            TarjontaAPI.usersApplicationOptions2($routeParams.id, $routeParams.oid).then(
                function (data) {
                    console.log('usersApplicationOptions2', $routeParams.id, $routeParams.oid);
                    $scope.$emit('LOADREADY');
                    if (data.length !== 0) {
                        $scope.applicationOptions = data;
                    } else {
                        AlertMsg($scope, 'warning', 'organisaatiossa.ei.hakukohdetta.hakukohdejoukko');
                    }
                }
            );

            $rootScope.LOGS('SelectHakukohdeDialogCtrl', $scope.applicationOptions);
            $scope.jatka = function (hakukohde) {
                $rootScope.LOGS('SelectHakukohdeDialogCtrl', 'jatka()', hakukohde);
                if (hakukohde.kayttoryhmat) {
                    QuestionData.setIsGroup(true);
                } else {
                    QuestionData.setIsGroup(false);
                }

                QuestionData.setApplicationOption(hakukohde);
                $modalInstance.close({
                    hakukohde: hakukohde,
                    applicationSystem: applicationSystem,
                    theme: theme
                });
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

        }]);

