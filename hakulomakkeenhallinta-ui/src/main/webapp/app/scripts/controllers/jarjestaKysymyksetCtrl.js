'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('jarjestaKysymyksetCtrl', ['$scope', '$rootScope', 'ThemeQuestions', '_', '$routeParams', 'AlertMsg',
        function ($scope, $rootScope, ThemeQuestions, _, $routeParams, AlertMsg) {
            var ordinals = {},
                orderQuestions = [];
            $scope.sortBtns = true;
            /**
             * vaihtaa näytä/piilota napit muuttujan arvoa
             */
            function toggleShowSortBtns() {
                $scope.sortBtns = !$scope.sortBtns;
                if (!$scope.naytaKysymysLista) {
                    $scope.toggleNaytaKysymykset();
                }
            };
            /**
             * aktivoi kysymysten järjestely napit
             * ja tallentaa kysymysten alkuperäisen järjestyksen
             * tallennusta ja peruuta toimintoa varten
             * @param themeId
             */
            $scope.sortQuestions = function (themeId, hakukohdeOid, question, option) {
                $rootScope.LOGS ('jarjestaKysymyksetCtrl', 'sortQuestions()', $routeParams.id, hakukohdeOid, themeId, $routeParams.oid);
                ThemeQuestions.getThemeQuestionByThemeLop($routeParams.id, hakukohdeOid, themeId, $routeParams.oid).then(
                    function success(data) {
                        if (option === undefined) {
                            //filtteröidään jatkokysymykset pois
                            data = _.filter(data, function (mainQ) {
                                if (mainQ.parentId === undefined) {
                                    return mainQ;
                                }
                            });

                            $scope.hakukohde.additionalQuestions = _.sortBy(_.map(data, function (aq) {
                                if (aq.hasOwnProperty('_id')) {
                                    return aq;
                                }
                            }),
                                function (d) {
                                    return d.ordinal;
                                }
                            );

                            orderQuestions = $scope.hakukohde.additionalQuestions;
                            _.each(data, function (question) {
                                    ordinals[question._id] = {};
                                    ordinals[question._id].oldOrdinal = question.ordinal ? question.ordinal : 0;
                                }
                            );
                        } else {
                            data = _.filter(data, function (jatkoQs) {
                                if (jatkoQs.parentId === question._id && jatkoQs.followupCondition === option.id) {
                                    return jatkoQs;
                                }
                            });
                            orderQuestions = data;
                            $scope.option.questions = data;
                            _.each(data, function (question) {
                                    ordinals[question._id] = {};
                                    ordinals[question._id].oldOrdinal = question.ordinal ? question.ordinal : 0;
                                }
                            );
                        }

                        toggleShowSortBtns();
                    },
                    function error(resp) {
                        $rootScope.LOGS('jarjestaKysymyksetCtrl', 'sortQuestions() ->', 'getThemeQuestionByThemeLop()', resp.statusText, resp.status);
                        AlertMsg($scope, 'warning', 'error.kysymysten.haku');
                    }
                );

            };
            /**
             * siirtää kysymystä listassa ylöspäin
             * @param qIndx siirrettävän kysymyksen indeksi taulukossa
             */
            $scope.up = function (qIndx) {
                var tmp = orderQuestions[qIndx];
                orderQuestions[qIndx] = orderQuestions[qIndx - 1];
                orderQuestions[qIndx].ordinal = qIndx + 1;
                tmp.ordinal = (qIndx - 1) + 1;
                orderQuestions[qIndx - 1] = tmp;
            };
            /**
             * siirtää kysymystä listassa alaspäin
             * @param qIndx siirrettävän kysymyksen indeksi taulukossa
             */
            $scope.down = function (qIndx) {
                var tmp = orderQuestions[qIndx];
                orderQuestions[qIndx] = orderQuestions[qIndx + 1];
                orderQuestions[qIndx].ordinal = qIndx + 1;
                tmp.ordinal = (qIndx + 1) + 1;
                orderQuestions[qIndx + 1] = tmp;
            };
            /**
             * tallentaan kysmysten järjetyksen lisäkymyksiin
             */
            $scope.saveSortQuestions = function (themeId, hakukohdeOid) {
                toggleShowSortBtns();
                for (var tqueId in ordinals) {
                    for (var newOrd = 0, saveQuesLength = orderQuestions.length; newOrd < saveQuesLength; newOrd += 1) {
                        if (tqueId === orderQuestions[newOrd]._id) {
                            ordinals[tqueId].newOrdinal = newOrd + 1;
                            break;
                        }
                    }
                }
                $rootScope.LOGS('jarjestaKysymyksetCtrl', 'saveSortQuestions()', 'ordinals:', ordinals);
                $rootScope.LOGS('jarjestaKysymyksetCtrl', 'saveSortQuestions()', 'hakukohde:', hakukohdeOid);
                $rootScope.LOGS('jarjestaKysymyksetCtrl', 'saveSortQuestions()', 'teema: ', themeId);
                $rootScope.LOGS('jarjestaKysymyksetCtrl', 'saveSortQuestions()', 'organisaatio: ', $routeParams.oid);
                ThemeQuestions.reorderThemeQuestions(hakukohdeOid, themeId, ordinals).then(
                    function success(data) {
                        $rootScope.LOGS('jarjestaKysymyksetCtrl', 'saveSortQuestions() ->', 'reorderThemeQuestions()', data);
                        $rootScope.LOGS('jarjestaKysymyksetCtrl', orderQuestions);
                        ThemeQuestions.getThemeQuestionByThemeLop($routeParams.id, hakukohdeOid, themeId, $routeParams.oid).then(
                            function success(data) {
                                $rootScope.LOGS('jarjestaKysymyksetCtrl', 'saveSortQuestions() ->', 'reorderThemeQuestions() -> getThemeQuestionByThemeLop()', data);
                                $scope.hakukohde.additionalQuestions = ThemeQuestions.jarjestaJatkokysymyksetPuu(data);
                                AlertMsg($scope, 'success', 'success.kysymysten.jarjestys');
                            },
                            function error(resp) {
                                $rootScope.LOGS('jarjestaKysymyksetCtrl', 'saveSortQuestions() ->', 'reorderThemeQuestions() -> getThemeQuestionByThemeLop()', resp.statusText, resp.status);
                                AlertMsg($scope, 'warning', 'error.kysymysten.haku');
                            }
                        );

                    }, function error(resp) {
                        $rootScope.LOGS('jarjestaKysymyksetCtrl', 'saveSortQuestions() ->', 'reorderThemeQuestions()', resp.statusText, resp.status);
                        AlertMsg($scope, 'warning', 'error.jarjestyksen.tallennus');
                    }
                );
            };
            /**
             * peruuttaa lisäkysymysten järjestelyn lähtötilanteeseen
             */
            $scope.cancelSortQuestions = function (themeId, hakukohdeOid) {
                toggleShowSortBtns();

                ThemeQuestions.getThemeQuestionByThemeLop($routeParams.id, hakukohdeOid, themeId, $routeParams.oid).then(
                    function success(data) {
                        $scope.hakukohde.additionalQuestions = ThemeQuestions.jarjestaJatkokysymyksetPuu(data);
                    },
                    function error(resp) {
                        $rootScope.LOGS('jarjestaKysymyksetCtrl', 'cancelSortQuestions() ->', 'getThemeQuestionByThemeLop()', resp.statusText, resp.status);
                        AlertMsg($scope, 'warning', 'error.kysymysten.haku');

                    }
                );
            };


    }]);
