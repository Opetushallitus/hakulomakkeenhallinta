'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('SelectOrganisationCtrl', ['$scope', '$rootScope', '$location', '$modalInstance', 'applicationSystemForm', 'Organisaatio', 'FormEditor', 'AlertMsg', 'TarjontaAPI', '$filter',
        function ($scope, $rootScope, $location, $modalInstance, applicationSystemForm, Organisaatio, FormEditor, AlertMsg, TarjontaAPI, $filter) {

            $rootScope.LOGS('SelectOrganisationCtrl');
            $scope.alerts = [];
            $scope.applicationOptions = [];
            $scope.applicationSystemForm = applicationSystemForm;
            $scope.organisations = [];

            $scope.$emit('LOAD');
            $rootScope.LOGS('SelectOrganisationCtrl ', 'loading value:' + $scope.loading);
            /**
             * haetaan valittuun hakulomakkeeseen liittyvät organisaatiot
             */
            FormEditor.getApplicationSystemFormOrgnisations(applicationSystemForm._id).then(
                function (data) {
                    $rootScope.LOGS('SelectOrganisationCtrl ', 'getApplicationSystemFormOrgnisations()', data);
                    $scope.$emit('LOADREADY');
                    if (data.length !== 0) {
                        $scope.organisations =  $filter('orderBy')(data, 'name.translations.' + $scope.userLang);
                    } else {
                        if (data.status === 0) {
                            AlertMsg($scope, 'warning', 'organisaatioita.ei.saatu.ladattua');
                        }
                        AlertMsg($scope, 'warning', 'ei.riittavia.kaytto.oikeuksia.tahan.hakuun');
                    }
                }
            );
            /**
             * asettaa valitun organisaation organisaation serviceen talteen myöhempää
             * käyttöä varten
             */
            $scope.selectedOrganisation = function () {
                if (this.organisation !==null) {
                    $rootScope.LOGS('SelectOrganisationCtrl', 'selectedOrganisation()', this.organisation);
                    Organisaatio.setOrganisation(this.organisation);
                    $scope.applicationOptions = TarjontaAPI.usersApplicationOptions(applicationSystemForm._id, this.organisation.id);
                }
            };
            /**
             * organisaation valinnan jälkeen siirrytään hakemuksen lisäkysymys sivulle
             */
            $scope.jatka = function () {
                $rootScope.LOGS('SelectOrganisationCtrl ', 'jatka() ', Organisaatio.getOrganisation().id);
                if (Organisaatio.getOrganisation().id !== undefined) {
                    FormEditor.setApplicationSystemForm(applicationSystemForm);
                    $modalInstance.dismiss('ok');
                    $location.path("/themeQuestionsByOrganisation/" + $scope.applicationSystemForm._id + '/' + Organisaatio.getOrganisation().id);
                }
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }]);
