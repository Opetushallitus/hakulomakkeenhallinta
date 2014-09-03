'use strict';

angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('hakukohdeLisakysmykset', ['$rootScope', 'TarjontaAPI', 'ThemeQuestions', 'AlertMsg', 'Organisaatio', '$modal', '_', '$routeParams', 'QuestionData', '$location',
        function ($rootScope, TarjontaAPI, ThemeQuestions, AlertMsg, Organisaatio, $modal, _, $routeParams, QuestionData, $location) {
            return {
                restrict: 'E',
                replace: true,
                template: '<div>' +
                    '<h4 data-ng-click="toggleNaytaHakukohdeKysymykset()"><a>{{ hakukohdeInfo | hakukohdeNimi:userLang }} <span data-ng-if="hakukohdeInfo.tarjoajaNimet" >:</span> {{ hakukohdeInfo.tarjoajaNimet[userLang] }}' +
                    '<i class="glyphicon" ng-class="{\'glyphicon-chevron-down\': naytaHakukohdeQues, \'glyphicon-chevron-right\': !naytaHakukohdeQues }"></i></a> </h4>' +
                    '<div class="form-group">' +
                    '<button type="button" class="btn" data-ng-click="cancelSortQuestions(hakukohde.additionalQuestions)" data-ng-show="naytaHakukohdeQues && !sortBtns">{{ t(\'peruuta\')|| \'Peruutak\' }}</button>' +
                    ' <button type="button" class="btn btn-primary" data-ng-click="saveSortQuestions(theme.id)" data-ng-show="naytaHakukohdeQues && !sortBtns">{{ t(\'tallenna.jarjestys\')|| \'Tallenna järjestys\' }}</button>' +
                    ' <button type="button" class="btn" data-ng-click="sortQuestions(hakukohde.additionalQuestions)" data-ng-show="naytaHakukohdeQues && sortBtns">{{ t(\'jarjesta.kysymykset\')|| \'Järjestä kysymykset\' }} </button>' +
                    ' <button type="button" class="btn disabled" data-ng-click="addRule()" data-ng-disabled="!addRule" data-ng-show="naytaHakukohdeQues && sortBtns">{{ t(\'lisaa.saanto\')|| \'Lisää sääntö\' }}</button>' +
                    '</div>' +
                    '<alertmsg></alertmsg>' +
                    '</div>',
                link: function (scope, element, attrs) {
                    var hakukohdeJson = JSON.parse(attrs.hakukohdeolio);
                    if (hakukohdeJson.additionalQuestions.length > 0 && hakukohdeJson.additionalQuestions[0].targetIsGroup) {
                        Organisaatio.getOrganisationData(hakukohdeJson.aoid).then(
                            function (data) {
                                scope.hakukohdeInfo = data;
                            }
                        );
                    } else {
                        TarjontaAPI.fetchHakukohdeInfo(hakukohdeJson.aoid).then(
                            function (data) {
                                scope.hakukohdeInfo = data;
                            }
                        );
                    }

                    scope.naytaHakukohdeQues = false;
                    scope.toggleNaytaHakukohdeKysymykset = function () {
                        scope.naytaHakukohdeQues = !scope.naytaHakukohdeQues;
                    };
                },
                controller: function ($scope) {

                    var ordinals = {};
                    $scope.sortBtns = true;
                    $scope.questions = [];
                    /**
                     * vaihtaa näytä/piilota napit muuttujan arvoa
                     */
                    function toggleShowSortBtns() {
                        $scope.sortBtns = !$scope.sortBtns;
                    };
                    /**
                     * aktivoi kysymysten järjestely napit
                     * ja tallentaa kysymysten alkuperäisen järjestyksen
                     * tallennusta ja peruuta toimintoa varten
                     * @param additionalQuestions
                     */
                    $scope.sortQuestions = function (additionalQuestions) {
                        $scope.questions = additionalQuestions;
                        toggleShowSortBtns();
                        for (var ord = 0, adnlQuesLength = additionalQuestions.length; ord < adnlQuesLength; ord += 1) {
                            ordinals[additionalQuestions[ord]._id] = {};
                            ordinals[additionalQuestions[ord]._id].oldOrdinal = additionalQuestions[ord].ordinal ? additionalQuestions[ord].ordinal : 0;
                        }
                    };
                    /**
                     * siirtää kysymystä listassa ylöspäin
                     * @param qIndx siirrettävän kysymyksen indeksi taulukossa
                     */
                    $scope.up = function (qIndx) {
                        var  tmp = $scope.questions[qIndx];
                        $scope.questions[qIndx] = $scope.questions[qIndx - 1];
                        $scope.questions[qIndx].ordinal = qIndx + 1;
                        tmp.ordinal = (qIndx - 1) + 1;
                        $scope.questions[qIndx - 1] = tmp;
                    };
                    /**
                     * siirtää kysymystä listassa alaspäin
                     * @param qIndx siirrettävän kysymyksen indeksi taulukossa
                     */
                    $scope.down = function (qIndx) {
                        var tmp = $scope.questions[qIndx];
                        $scope.questions[qIndx] = $scope.questions[qIndx + 1];
                        $scope.questions[qIndx].ordinal = qIndx + 1;
                        tmp.ordinal = (qIndx + 1) + 1;
                        $scope.questions[qIndx + 1] = tmp;
                    };
                    /**
                     * tallentaan kysmysten järjetyksen lisäkymyksiin
                     */
                    $scope.saveSortQuestions = function (themeId){
                        toggleShowSortBtns();
                        for (var tqueId in ordinals){
                            for (var newOrd = 0, saveQuesLength = $scope.questions.length; newOrd < saveQuesLength; newOrd +=1){
                                if (tqueId === $scope.questions[newOrd]._id){
                                    ordinals[tqueId].newOrdinal = newOrd + 1;
                                    break;
                                }
                            }
                        }
                        $rootScope.LOGS('hakukohdeLisakysmykset', 'saveSortQuestions()', 'ordinals:', ordinals);
                        $rootScope.LOGS('hakukohdeLisakysmykset', 'saveSortQuestions()', 'hakukohde:', $scope.hakukohdeInfo.oid);
                        $rootScope.LOGS('hakukohdeLisakysmykset', 'saveSortQuestions()', 'teema: ', themeId);
                        $rootScope.LOGS('hakukohdeLisakysmykset', 'saveSortQuestions()', 'organisaatio: ', $routeParams.oid);
                        ThemeQuestions.reorderThemeQuestions($scope.hakukohdeInfo.oid, themeId, ordinals).then(
                            function success (data) {
                                $rootScope.LOGS('hakukohdeLisakysmykset', 'saveSortQuestions() ->', 'reorderThemeQuestions()', data);
                                $rootScope.LOGS('hakukohdeLisakysmykset', $scope.questions);
                                ThemeQuestions.getThemeQuestionByThemeLop($routeParams.id, $scope.hakukohde.oid, themeId, $routeParams.oid).then(
                                    function success (data) {
                                        $rootScope.LOGS('hakukohdeLisakysmykset', 'saveSortQuestions() ->', 'reorderThemeQuestions() -> getThemeQuestionByThemeLop()', data);
                                        $scope.questions = data;
                                        AlertMsg($scope, 'success', 'success.kysymysten.jarjestys');
                                    },
                                    function error (resp) {
                                        $rootScope.LOGS('hakukohdeLisakysmykset', 'saveSortQuestions() ->', 'reorderThemeQuestions() -> getThemeQuestionByThemeLop()', resp.statusText, resp.status);
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
                    $scope.cancelSortQuestions = function () {
                        toggleShowSortBtns();
                        for (var tqId in ordinals){
                            $rootScope.LOGS('hakukohdeLisakysmykset', ordinals[tqId], tqId);
                            for (var ord = 0, quesLength = $scope.questions.length; ord < quesLength; ord += 1){
                                if ($scope.questions[ord]._id === tqId){
                                    $scope.questions[ord].ordinal = ordinals[tqId].oldOrdinal;
                                }
                            }
                        }
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
                    $scope.muokkaaKysymysta = function(question, sortBtns){
                        if (sortBtns) {
                            QuestionData.setEditFlag(true);
                            $rootScope.LOGS('hakukohdeLisakysmykset ', 'muokkaaKysmysta()', question._id);
                            ThemeQuestions.getThemeQuestionById(question._id).then(
                                function (data) {
                                    $rootScope.LOGS('hakukohdeLisakysmykset','muokkaaKysymysta() data:', data);
                                    QuestionData.setQuestion(data);
                                    $location.path('/modifyThemeQuestion/'+$routeParams.id+'/'+$routeParams.oid+'/'+ question._id);
                                }
                            );
                        }
                    };
                }
            };
        }]);

