'use strict';

angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('hakukohdeLisakysmykset', [ 'TarjontaAPI', function (TarjontaAPI) {
        return {
            restrict: 'E',
            replace: true,
            template: '<div>' +
                '<h4 data-ng-click=\"toggleNaytaHakukohdeKysymykset()\"><a>{{ hakukohdeInfo.hakukohteenNimi }} : {{ hakukohdeInfo.tarjoajaNimet.fi }}' +
                '<i class=\"glyphicon\" ng-class=\"{\'glyphicon-chevron-down\': naytaHakukohdeQues, \'glyphicon-chevron-right\': !naytaHakukohdeQues }\"></i></a> </h4>' +
                '<div class="form-group">' +
                '<button type=\"button\" class=\"btn\" data-ng-click=\"sortQuestions(hakukohde.additionalQuestions)\" data-ng-show="naytaHakukohdeQues">Järjestä kysymykset</button>' +
                '<button type=\"button\" class=\"btn\" data-ng-click=\"addRule()" data-ng-disabled=\"!addRule\" data-ng-show="naytaHakukohdeQues">  Lisää sääntö</button>' +
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

                $scope.sortBtns = true;
                $scope.questions = [];
                $scope.sortQuestions = function (additionalQuestions) {
                    $scope.questions = additionalQuestions;
                    $scope.sortBtns = !$scope.sortBtns;
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

            }
        };
    }]);

