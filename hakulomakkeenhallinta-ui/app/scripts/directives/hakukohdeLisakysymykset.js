'use strict';

angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('hakukohdeLisakysmykset', ['$rootScope', '$scope', 'TarjontaAPI', 'ThemeQuestions', 'AlertMsg', function ($rootScope, $scope, TarjontaAPI, ThemeQuestions, AlertMsg) {
        return {
            restrict: 'E',
            replace: true,
            template: '<div>' +
                '<h4 data-ng-click="toggleNaytaHakukohdeKysymykset()"><a>{{ hakukohdeInfo | hakukohdeNimi:userLang }} : {{ hakukohdeInfo.tarjoajaNimet[userLang]  }}' +
                '<i class="glyphicon" ng-class="{\'glyphicon-chevron-down\': naytaHakukohdeQues, \'glyphicon-chevron-right\': !naytaHakukohdeQues }"></i></a> </h4>' +
                '<div class="form-group">' +
                '<button type="button" class="btn" data-ng-click="cancelSortQuestions(hakukohde.additionalQuestions)" data-ng-show="naytaHakukohdeQues && !sortBtns">{{ t(\'peruuta\')|| \'Peruutak\' }}</button>' +
                ' <button type="button" class="btn btn-primary" data-ng-click="saveSortQuestions(theme.id)" data-ng-show="naytaHakukohdeQues && !sortBtns">{{ t(\'tallenna.jarjestys\')|| \'Tallenne järjestys\' }}</button>' +
                ' <button type="button" class="btn" data-ng-click="sortQuestions(hakukohde.additionalQuestions)" data-ng-show="naytaHakukohdeQues && sortBtns">{{ t(\'jarjesta.kysymykset\')|| \'Järjestä kysymykset\' }} </button>' +
                ' <button type="button" class="btn disabled" data-ng-click="addRule()" data-ng-disabled="!addRule" data-ng-show="naytaHakukohdeQues && sortBtns">{{ t(\'lisaa.saanto\')|| \'Lisää sääntö\' }}</button>' +
                '</div>' +
                '<alertmsg></alertmsg>' +
                '</div>',
            link: function (scope, element, attrs) {
                TarjontaAPI.fetchHakukohdeInfo(attrs.aoid).then(
                    function (data) {
                        scope.hakukohdeInfo = data;
                    }
                );

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
                    ThemeQuestions.reorderThemeQuestions($scope.hakukohdeInfo.oid, themeId, ordinals).then(
                        function success (data) {
                            $rootScope.LOGS('hakukohdeLisakysmykset', 'saveSortQuestions() ->', 'reorderThemeQuestions()', data);
                            $rootScope.LOGS('hakukohdeLisakysmykset', $scope.questions);
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
                        console.log(ordinals[tqId], tqId);
                        for (var ord = 0, quesLength = $scope.questions.length; ord < quesLength; ord += 1){
                            if ($scope.questions[ord]._id === tqId){
                                $scope.questions[ord].ordinal = ordinals[tqId].oldOrdinal;
                            }
                        }
                    }
                };

            }
        };
    }]);

