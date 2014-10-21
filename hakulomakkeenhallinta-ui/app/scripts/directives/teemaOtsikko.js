'use strickt';

angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('teemaOtsikko', function () {
        return {
            restrict: 'E',
            replace: true,
            template: '<div><div class="hh-list-h3"><i data-ng-class="{\'hh-icon-right\':!naytaHakukohteet, \'hh-icon-down\':naytaHakukohteet}" data-ng-click="toggleNaytaHakukohteet()" ></i>' +
                '<div class="dropdown" style="display: inline-block !important;"> <a class="dropdown-toggle">' +
                '<i class="hh-icon-menu"></i>' +
                '</a>' +
                '<ul class="dropdown-menu">' +
                '<li data-ng-click="addQuestion(theme)"><a>{{ t(\'lisaa.uusi.kysymys\') || \'Lisää uusi kysymys\' }} <i class="glyphicon glyphicon-plus"></i></a></li>' +
                '<li data-ng-click="showAllQuestions()"><a>{{ t(\'nayta.piilota.kysymykset\') || \'Näytä/piilota kysymykset\' }} <i class="glyphicon glyphicon-resize-vertical"></i></a></li>' +
                '</ul>' +
                '</div>' +
                '<a data-ng-click="toggleNaytaHakukohteet()"> {{ theme | i18n:\'name\':userLang }} ({{hakukohdeMaara}})</a></div>' +
                '</div>',
            link: function ($scope, element, attrs) {
                var teema = JSON.parse(attrs.teema);
                $scope.hakukohdeMaara = 0;
                if (teema.hkkohde !== undefined && teema.hkkohde.length > 0) {
                    $scope.hakukohdeMaara = teema.hkkohde.length;
                }
            },
            controller: function ($scope) {
                $scope.naytaHakukohteet = false;
                /**
                 * näyttää / piilottaa teeman alla olevat hakukohteet
                 */
                $scope.toggleNaytaHakukohteet = function () {
                    if ($scope.hakukohdeMaara > 0) {
                        $scope.naytaHakukohteet = !$scope.naytaHakukohteet;
                    }
                };
                /**
                 * näyttää / piilottaa kaikki hakukohteessa olevat kysymykset
                 * lähettää arvon lapsi $scope:ssa olevalle kuuntelijalle
                 */
                $scope.showAllQuestions = function () {
                    if (!$scope.naytaHakukohteet) {
                        $scope.toggleNaytaHakukohteet();
                    }
                    $scope.$broadcast('SHOW_HIDE_ALL_QUESTION');
                };

            }
        };

    });