'use strict';

angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('hakukohdeLisakysymykset', ['$rootScope', 'TarjontaAPI', 'ThemeQuestions', 'AlertMsg', 'Organisaatio', '$modal', '_', '$routeParams', 'QuestionData', '$location',
        function ($rootScope, TarjontaAPI, ThemeQuestions, AlertMsg, Organisaatio, $modal, _, $routeParams, QuestionData, $location) {
            return {
                restrict: 'E',
                replace: true,
                template: '<div data-ng-hide="hakukohdePoistettu">' +
                    '<div class="hh-list-h4">' +
                    '<i class="glyphicon" data-ng-class="{\'hh-icon-right\':!naytaKysymysLista, \'hh-icon-down\':naytaKysymysLista}" data-ng-click="toggleNaytaKysymykset()"></i>' +

                    '<div class="dropdown" style="display: inline-block !important;">' +
                    '<a class="dropdown-toggle" data-ng-hide="hakukohdePoistettu">' +
                    '<i class="hh-icon-menu"></i>' +
                    '</a>' +
                    '<ul class="dropdown-menu">' +
                    '<li data-ng-click="addQuestionAtHakukohde(theme, hakukohde)"><a>{{ t(\'lisaa.uusi.kysymys\') || \'Lisää uusi kysymys\' }} <i class="glyphicon glyphicon-plus"></i></a></li>' +
                    '<li data-ng-click="sortQuestions(theme.id, hakukohdeInfo.oid)"><a>{{ t(\'jarjesta.kysymykset\')|| \'Järjestä kysymykset\' }} <i class="glyphicon glyphicon-sort"></i></a> </li>' +
                    '</ul>' +
                    '</div>' +
                    '<a data-ng-click="toggleNaytaKysymykset()">{{ hakukohdeInfo | hakukohdeNimi:userLang }} ' +
                    '<span data-ng-if="hakukohdeInfo.tarjoajaNimet" >: {{ hakukohdeInfo.tarjoajaNimet[userLang] }}</span> ' +
                    '<span data-ng-if="hakukohdeInfo.tyypit" >: {{ hakukohdeInfo.tyypit[0] }}</span> ' +
                    '({{kysymysMaara}})</a>' +
                    '</div>' +

                    '<div class="form-group" data-ng-show="!sortBtns && naytaKysymysLista">' +
                    '<button type="button" class="btn" data-ng-click="cancelSortQuestions(theme.id, hakukohdeInfo.oid)" data-ng-show="!sortBtns">{{ t(\'peruuta\')|| \'Peruutak\' }}</button> &nbsp;' +
                    '<button type="button" class="btn btn-primary" data-ng-click="saveSortQuestions(theme.id, hakukohdeInfo.oid)" data-ng-show="!sortBtns">{{ t(\'tallenna.jarjestys\')|| \'Tallenna järjestys\' }}</button>' +
                    '</div>' +
                    '<alertmsg></alertmsg>' +
                    '</div>',
                controller: function ($scope) {
                    var ordinals = {},
                        orderQuestions = [];
                    $scope.sortBtns = true;

                    $scope.hakukohdePoistettu = false;
                    $scope.kysymysMaara = 0;



//                        $scope.naytaKysymysLista = false;
                    $scope.naytaKysymysLista = true;
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
                     * vaihtaa näytä/piilota napit muuttujan arvoa
                     */
                    function toggleShowSortBtns() {
                        $scope.sortBtns = !$scope.sortBtns;
                        if (!$scope.naytaKysymysLista) {
                            $scope.toggleNaytaKysymykset();
                        }
                    };
                    /**
                     * Avaa kaikki teemassa olevat kysymykset näkymään
                     * lähetetty $broadcast arvo tulee parent $scope:sta
                     */
                    $scope.$on('SHOW_HIDE_ALL_QUESTION', function () {
                            $scope.toggleNaytaKysymykset();
                        }
                    );
                    /**
                     * aktivoi kysymysten järjestely napit
                     * ja tallentaa kysymysten alkuperäisen järjestyksen
                     * tallennusta ja peruuta toimintoa varten
                     * @param themeId
                     */
                    $scope.sortQuestions = function (themeId, hakukohdeOid) {
                        console.log('Järjestä kysymykset: ', $routeParams.id, hakukohdeOid, themeId, $routeParams.oid);
                        ThemeQuestions.getThemeQuestionByThemeLop($routeParams.id, hakukohdeOid, themeId, $routeParams.oid).then(
                            function success(data) {
                                $scope.hakukohde.additionalQuestions = _.sortBy(_.map(data, function (aq) { if (aq.hasOwnProperty('_id')) return aq; }),
                                    function (d) {
                                        return d.ordinal;
                                    }
                                );
                                console.log('järjestättävät kysymykset: ', $scope.hakukohde.additionalQuestions);
                                orderQuestions = $scope.hakukohde.additionalQuestions;
                                _.each(data, function (question) {
                                        ordinals[question._id] = {};
                                        ordinals[question._id].oldOrdinal = question.ordinal ? question.ordinal : 0;
                                    }
                                );
                                toggleShowSortBtns();
                            },
                            function error(resp) {
                                $rootScope.LOGS('hakukohdeLisakysmykset', 'sortQuestions() ->', 'getThemeQuestionByThemeLop()', resp.statusText, resp.status);
                                AlertMsg($scope, 'warning', 'error.kysymysten.haku');
                            }
                        );

                    };
                    /**
                     * siirtää kysymystä listassa ylöspäin
                     * @param qIndx siirrettävän kysymyksen indeksi taulukossa
                     */
                    $scope.up = function (qIndx) {
                        var  tmp = orderQuestions[qIndx];
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
                    $scope.saveSortQuestions = function (themeId, hakukohdeOid){
                        toggleShowSortBtns();
                        for (var tqueId in ordinals){
                            for (var newOrd = 0, saveQuesLength = orderQuestions.length; newOrd < saveQuesLength; newOrd +=1){
                                if (tqueId === orderQuestions[newOrd]._id){
                                    ordinals[tqueId].newOrdinal = newOrd + 1;
                                    break;
                                }
                            }
                        }
                        $rootScope.LOGS('hakukohdeLisakysmykset', 'saveSortQuestions()', 'ordinals:', ordinals);
                        $rootScope.LOGS('hakukohdeLisakysmykset', 'saveSortQuestions()', 'hakukohde:', hakukohdeOid);
                        $rootScope.LOGS('hakukohdeLisakysmykset', 'saveSortQuestions()', 'teema: ', themeId);
                        $rootScope.LOGS('hakukohdeLisakysmykset', 'saveSortQuestions()', 'organisaatio: ', $routeParams.oid);
                        ThemeQuestions.reorderThemeQuestions(hakukohdeOid, themeId, ordinals).then(
                            function success (data) {
                                $rootScope.LOGS('hakukohdeLisakysmykset', 'saveSortQuestions() ->', 'reorderThemeQuestions()', data);
                                $rootScope.LOGS('hakukohdeLisakysmykset', orderQuestions);
                                ThemeQuestions.getThemeQuestionByThemeLop($routeParams.id, hakukohdeOid, themeId, $routeParams.oid).then(
                                    function success (data) {
                                        $rootScope.LOGS('hakukohdeLisakysmykset', 'saveSortQuestions() ->', 'reorderThemeQuestions() -> getThemeQuestionByThemeLop()', data);
                                        $scope.hakukohde.additionalQuestions = data;
                                        AlertMsg($scope, 'success', 'success.kysymysten.jarjestys');
                                    },
                                    function error (resp) {
                                        $rootScope.LOGS('hakukohdeLisakysmykset', 'saveSortQuestions() ->', 'reorderThemeQuestions() -> getThemeQuestionByThemeLop()', resp.statusText, resp.status);
                                        AlertMsg($scope, 'warning', 'error.kysymysten.haku');
                                    }
                                );

                            }, function error (resp) {
                                $rootScope.LOGS('hakukohdeLisakysmykset', 'saveSortQuestions() ->', 'reorderThemeQuestions()', resp.statusText, resp.status);
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
                                $scope.hakukohde.additionalQuestions = data;
                            },
                            function error(resp) {
                                $rootScope.LOGS('hakukohdeLisakysmykset', 'cancelSortQuestions() ->', 'getThemeQuestionByThemeLop()', resp.statusText, resp.status);
                                AlertMsg($scope, 'warning', 'error.kysymysten.haku');

                            }
                        );
                    };
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
                                        $scope.hakukohde.additionalQuestions = data;
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
                                    $rootScope.LOGS('hakukohdeLisakysmykset','muokkaaKysymysta() data:', data);
                                    QuestionData.setQuestion(data);
                                    $location.path('/modifyThemeQuestion/'+$routeParams.id + '/' + $routeParams.oid + '/' + question._id);
                                }
                            );
                        }
                    };
                }
            };
        }]);

