'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('HakulomakkeetListaCtrl', ['$scope', '$rootScope', '$modal', '$log', '$location', 'FormEditor',
        function ($scope, $rootScope, $modal, $log, $location, FormEditor) {
            $rootScope.LOGS('HakulomakkeetListaCtrl');

            $scope.applicationForms = [];
            /**
             * haetaan hakulomakkeet lista
             */
            FormEditor.getApplicationSystemForms().then(
                function (data) {
                    $scope.applicationForms = data;
                }
            );

            /**
             * avataan organisaation valinta dialogi valitulle hakulomakkeell
             * @param applicationSystemForm valittu hakulomake
             */
            $scope.valitseOrganisaatio = function (applicationSystemForm) {
                $rootScope.LOGS('HakulomakkeetListaCtrl', 'valitseOrganisaatio()', applicationSystemForm);
                    $modal.open({
                    templateUrl: 'partials/dialogs/organisaation-valinta.html',
                    controller: 'SelectOrganisationCtrl',
                    scope: $scope,
                    resolve: {
                        applicationSystemForm: function () {
                            return applicationSystemForm;
                        }
                    }
                });
            };
        }
    ]);
