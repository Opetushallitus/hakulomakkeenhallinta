'use strict';

angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('hakukohdeLisakysmykset', [ 'TarjontaAPI', function (TarjontaAPI) {
        return {
            restrict: 'E',
            replace: true,
            template: '<div>' +
                '<h4 data-ng-click="toggleNaytaHakukohdeKysymykset()"><a>{{ hakukohdeInfo.hakukohteenNimi }} : {{ hakukohdeInfo.tarjoajaNimet.fi }}' +
                '<i class="glyphicon" ng-class="{\'glyphicon-chevron-down\': naytaHakukohdeQues, \'glyphicon-chevron-right\': !naytaHakukohdeQues }"></i></a> </h4>' +
                '<div class="form-group">' +
                '<button type="button" class="btn" data-ng-click="cancelSortQuestions(hakukohde.additionalQuestions)" data-ng-show="naytaHakukohdeQues && !sortBtns">Peruuta</button>' +
                '<button type="button" class="btn btn-primary" data-ng-click="saveSortQuestions()" data-ng-show="naytaHakukohdeQues && !sortBtns">Tallenne järjestys</button>' +
                '<button type="button" class="btn" data-ng-click="sortQuestions(hakukohde.additionalQuestions)" data-ng-show="naytaHakukohdeQues && sortBtns">Järjestä kysymykset</button>' +
                '<button type="button" class="btn" data-ng-click="addRule()" data-ng-disabled="!addRule" data-ng-show="naytaHakukohdeQues && sortBtns">  Lisää sääntö</button>' +
                '</div></div>',
            link: function (scope, element, attrs) {
                TarjontaAPI.fetchHakukohdeInfo(attrs.aoid).then(function (data) {
                    scope.hakukohdeInfo = data;
                });

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
                 * vaihtaa näytä nappien muuttujan arvoa
                 */
                function toggleShowSortBtns () {
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
                    for( var ord = 0; ord<additionalQuestions.length ; ord += 1){
                        ordinals[additionalQuestions[ord]._id] = {};
                        ordinals[additionalQuestions[ord]._id].oldOrdinal = additionalQuestions[ord].ordinal;
                    }
                };
                /**
                 * siirtää kysymystä listassa ylöspäin
                 * @param qIndx siirrettävän kysymyksen indeksi taulukossa
                 */
                $scope.up = function (qIndx) {
                    var  tmp = $scope.questions[qIndx];
                    $scope.questions[qIndx] = $scope.questions[qIndx - 1];
                    $scope.questions[qIndx].ordinal = qIndx;
                    tmp.ordinal = qIndx - 1;
                    $scope.questions[qIndx - 1] = tmp;
                };
                /**
                 * siirtää kysymystä listassa alaspäin
                 * @param qIndx siirrettävän kysymyksen indeksi taulukossa
                 */
                $scope.down = function (qIndx) {
                    var tmp = $scope.questions[qIndx];
                    $scope.questions[qIndx] = $scope.questions[qIndx + 1];
                    $scope.questions[qIndx].ordinal = qIndx;
                    tmp.ordinal = qIndx + 1;
                    $scope.questions[qIndx + 1] = tmp;
                };
                /**
                 * tallentaan kysmysten järjetyksen lisäkymyksiin
                 */
                $scope.saveSortQuestions = function (){
                    console.log('Tallenetaan järjestys', ordinals);
                    toggleShowSortBtns();
                };
                /**
                 * peruuttaa lisäkysymysten järjestelyn lähtötilanteeseen
                 */
                $scope.cancelSortQuestions = function () {
                    toggleShowSortBtns();
                    for(var tqId in ordinals){
                        console.log(ordinals[tqId], tqId);
                        for(var ord = 0; ord < $scope.questions.length ; ord += 1){
                            if($scope.questions[ord]._id === tqId){
                                $scope.questions[ord].ordinal = ordinals[tqId].oldOrdinal;
                            }
                        }
                    }
                };

            }
        };
    }]);

