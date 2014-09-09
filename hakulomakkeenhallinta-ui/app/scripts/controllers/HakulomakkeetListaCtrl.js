'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('HakulomakkeetListaCtrl', ['$scope', '$rootScope', '$modal', '$log', '$location', 'FormEditor', '_', '$filter', 'Koodisto',
        function ($scope, $rootScope, $modal, $log, $location, FormEditor, _, $filter, Koodisto) {
            $rootScope.LOGS('HakulomakkeetListaCtrl');

            $scope.applicationForms = [];
            $scope.statukset = [];
            $scope.vuodet = [];
            $scope.kaudet = [];
            $scope.hakutyypit = [];
            /**
             * haetaan hakulomakkeet lista
             */
            FormEditor.getApplicationSystemForms().then(
                function (data) {
                    $scope.statukset = _.uniq(_.map(data, function (status) { return status.status.translations[$scope.userLang]; }));
                    $scope.statukset.push('');
                    $scope.statukset =  $filter('orderBy')($scope.statukset, 'toString()');

                    $scope.vuodet = _.uniq(_.map(data, function (vuosi) { return vuosi.year; }));
                    $scope.vuodet.push('');
                    $scope.vuodet =  $filter('orderBy')($scope.vuodet, 'toString()');

                    Koodisto.getKausiKoodit().then(
                        function (kausiKoodit) {
                            kausiKoodit.push({period: ''});
                            $scope.kaudet =  $filter('orderBy')(kausiKoodit, 'period');
                        }
                    );
                    Koodisto.getHakutyyppiKoodit().then(
                        function (hakutyyppiKoodit) {
                            hakutyyppiKoodit.push(
                                {
                                    translations: {
                                        fi: '',
                                        sv: ''
                                    }
                                }
                            );
                            $scope.hakutyypit = $filter('orderBy')(hakutyyppiKoodit, 'translations.' + $scope.userLang);
                        }
                    );
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
