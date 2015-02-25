'use strict';

angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('hakukohdeLisakysymykset', ['$rootScope', 'TarjontaAPI', 'ThemeQuestions', 'AlertMsg', 'Organisaatio', '$modal', '_', '$routeParams', 'QuestionData', '$location',
        function ($rootScope, TarjontaAPI, ThemeQuestions, AlertMsg, Organisaatio, $modal, _, $routeParams, QuestionData, $location) {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'partials/directives/hakukohdeLisakysymykset.html',
                controller: function ($scope) {

                    $scope.hakukohdePoistettu = false;
                    $scope.kysymysMaara = 0;

                    $scope.naytaKysymysLista = false;

                    $scope.toggleNaytaKysymykset = function () {
                        $scope.naytaKysymysLista = !$scope.naytaKysymysLista;
                    };

                    if ($scope.hakukohde.additionalQuestions) {
                        $scope.kysymysMaara = $scope.hakukohde.additionalQuestions.length;
                    }


                    if ($scope.hakukohde.additionalQuestions.length > 0 && $scope.hakukohde.additionalQuestions[0].targetIsGroup) {
                        Organisaatio.getOrganisationData($scope.hakukohde.aoid).then(
                            function (data) {
                                if (data.oid) {
                                    $scope.hakukohdeInfo = data;
                                    $scope.setHakukohdeMaara();
                                } else {
                                    $scope.hakukohdePoistettu = true;
                                    $scope.hakukohdeInfo = {};
                                    $scope.hakukohdeInfo.nimi = {
                                        fi: 'HAKUKOHDE RYHMÄ POISTETTU',
                                        sv: 'HAKUKOHDE RYHMÄ POISTETTU',
                                        en: 'HAKUKOHDE RYHMÄ POISTETTU'
                                    };
                                }
                            }
                        );
                    } else {
                        TarjontaAPI.fetchHakukohdeInfo($scope.hakukohde.aoid).then(
                            function (data) {
                                if (data === 'NOT_FOUND') {
                                    $scope.hakukohdePoistettu = true;
                                    $scope.hakukohdeInfo = {};
                                    $scope.hakukohdeInfo.nimi = {
                                        fi: 'HAKUKOHDE POISTETTU',
                                        sv: 'HAKUKOHDE POISTETTU',
                                        en: 'HAKUKOHDE POISTETTU'
                                    };
                                } else {
                                    $scope.hakukohdeInfo = data;
                                    $scope.setHakukohdeMaara();
                                }

                            }
                        );
                    }
                    /**
                     * Avaa kaikki teemassa olevat kysymykset näkymään
                     * lähetetty $broadcast arvo tulee parent $scope:sta
                     */
                    $scope.$on('SHOW_HIDE_ALL_QUESTION', function () {
                            $scope.toggleNaytaKysymykset();
                        }
                    );
                    /**
                     * avaa varmistus dialogin kysymyksen poistolle
                     * hakukohdekohtaisen lisäkymys listasta
                     * @param question poistettavan kysymyksen tiedot objekti
                     */
                    $scope.poistaKysymys = function (question) {
                        $modal.open({
                            templateUrl: 'partials/dialogs/poista-kysymys-dialog.html',
                            controller: 'poistaKysymysDialogCtrl',
                            scope: $scope,
                            resolve: {
                                question: function () {
                                    return question;
                                },
                                where: function () {
                                    return 'list';
                                }
                            }
                        }).result.then( function () {
                                ThemeQuestions.getThemeQuestionByThemeLop($routeParams.id, $scope.hakukohde.aoid, $scope.theme.id, $routeParams.oid).then(
                                    function success (data) {
                                        $scope.hakukohde.additionalQuestions = ThemeQuestions.jarjestaJatkokysymyksetPuu(data);
                                        AlertMsg($scope, 'success', 'kysymyksen.poisto.ok');
                                    },
                                    function error (resp) {
                                        $rootScope.LOGS('hakukohdeLisakysmykset', 'poistaKysymys()', resp.messageText, resp.status);
                                        AlertMsg($scope, 'warning', 'error.kysymyksen.poisto');
                                    }
                                );
                            }
                        );
                    };
                    /**
                     * valitun kysymyksen muokkaus näkymään
                     * @param question valittu kysymys
                     * @param sortBtns kysymysten järjestämis lippu
                     */
                    $scope.muokkaaKysymysta = function (question, sortBtns) {
                        if (sortBtns) {
                            QuestionData.setEditFlag(true);
                            $rootScope.LOGS('hakukohdeLisakysmykset ', 'muokkaaKysmysta()', question._id);
                            ThemeQuestions.getThemeQuestionById(question._id).then(
                                function (data) {
                                    $rootScope.LOGS('hakukohdeLisakysmykset', 'muokkaaKysymysta() data:', data);
                                    QuestionData.setQuestion(data);
                                    $location.path('/modifyThemeQuestion/' + $routeParams.id + '/' + $routeParams.oid + '/' + question._id);
                                }
                            );
                        }
                    };
                }
            };
        }]);

