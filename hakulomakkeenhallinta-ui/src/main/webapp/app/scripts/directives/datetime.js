'use strict';

angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('datetime', [ '$filter', 'LocalisationService',
        function ($filter, LocalisationService) {
            return {
            restrict: 'E',
            replace: true,
            templateUrl: 'partials/directives/datetime.html',
            require: '^form',
            scope: {
                datetime: '=datetime',
                label: '@label',
                isRequired: '@isRequired'
            },
            link: function(scope, element, attrs, formControl) {
                scope.form = formControl;

            },
            controller: function ($scope) {
                $scope.t = function (key) {
                    return LocalisationService.tl(key);
                };
                $scope.isRequired = ($scope.isRequired === 'true');
                $scope.tanaan = new Date();
                $scope.tanaan.setHours(23, 59);
                var vuosiPvm = new Date();
                vuosiPvm.setFullYear(vuosiPvm.getFullYear() + 1);
                $scope.vuosi = vuosiPvm.setHours(23, 59);
                $scope.datePicOpen = false;

                if ($scope.datetime!== undefined) {
                    var paivaObject = new Date($scope.datetime);
                    $scope.time = toHHMMTime($scope.datetime);
                    $scope.date = $filter('date')(paivaObject, 'dd.MM.yyyy');
                }
                else {
                    $scope.time = toHHMMTime($scope.tanaan);
                }

                $scope.openDatePicker = function () {
                    $scope.datePicOpen = true;
                };

                /**
                 * yhdistää pvm:n ja kellon
                 */
                $scope.$watch('[date, time]', function() {
                    if($scope.date == null) {
                        $scope.datetime = null;
                    } else if ($scope.time  !== undefined && $scope.time  !== '' && typeof $scope.date === 'object') {
                        var nd = new Date($scope.date.getFullYear(), $scope.date.getMonth(), $scope.date.getDate(), $scope.time.substr(0, 2), $scope.time .substr(3, 2));
                        $scope.datetime = Date.parse(nd);
                    }
                });

                /**
                 * muokkaa kellon aikaa kaksi numeroiseksi merkkijonoksia
                 * @param hhmm kellon ajan tunnit /minuutit
                 * @returns {*} kaksinumeroisen merkkijonon kellon ajasta
                 */
                function addZeros(hhmm) {
                    if (hhmm < 10) {
                        hhmm = '0' + hhmm;
                    }
                    return hhmm;
                }
                /**
                 * parsiin kellon ajan päivä objektista
                 * @param date
                 * @returns {string} paluttaa kellon ajan mutoa hh:mm
                 */
                function toHHMMTime(date) {
                    var dmsec;
                    if (typeof date === 'Object') {
                        dmsec = Date.parse(date);
                    } else {
                        dmsec = date;
                    }
                    var hhmm = new Date(dmsec),
                        hh = addZeros(hhmm.getHours()),
                        mm = addZeros(hhmm.getMinutes());
                    return hh + ':' + mm;
                }
            }
        };

    }]);