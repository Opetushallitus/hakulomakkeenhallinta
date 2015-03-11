'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('AppendixRequestCtrl', ['$scope', '$modalInstance', 'attachmentRequest', '$timeout', '_', '$filter',
        function($scope, $modalInstance, attachmentRequest, $timeout, _, $filter) {
            $scope.attachmentRequest = attachmentRequest;

            $scope.tanaan = new Date();
            $scope.tanaan.setHours(23, 59);
            var vuosiPvm = new Date();
            vuosiPvm.setFullYear(vuosiPvm.getFullYear() + 1);
            $scope.vuosi = vuosiPvm.setHours(23, 59);
            $scope.lisaaCliked = false;
            $scope.datePicOpen = false;
            $scope.modify = false;

            if ($scope.attachmentRequest.deliveryDue  !== undefined) {
                $scope.modify = true;
            }

            if ($scope.attachmentRequest.deliveryDue !== undefined &&
                typeof $scope.attachmentRequest.deliveryDue !== 'object') {
                var paivaObject = new Date($scope.attachmentRequest.deliveryDue);
                $scope.toimitusaika = toHHMMTime($scope.attachmentRequest.deliveryDue);
                $scope.attachmentRequest.deliveryDue = $filter('date')(paivaObject, 'dd.MM.yyyy');

            }

            /**
             * tallentaa liitepyynnön ja sulkee liitepyyntö dialogin
             * @param valid
             */
            $scope.tallennaLiitepyynto = function () {
                $scope.lisaaCliked = true;
                if ($scope.liitepyyntoDialog.$valid) {
                    $scope.setKellonaikaToDate();
                    $modalInstance.close($scope.attachmentRequest);
                }
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
            /**
             * asettaa kellon ajan päivä objetiin
             */
            $scope.setKellonaikaToDate = function () {
                if (this.toimitusaika !== undefined && this.toimitusaika !== '' && $scope.attachmentRequest.deliveryDue !== '') {
                    var dmsec = Date.parse($scope.attachmentRequest.deliveryDue),
                        d = new Date(dmsec),
                        t = this.toimitusaika;
                    var nd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), t.substr(0, 2), t.substr(3, 2));
                    $scope.attachmentRequest.deliveryDue = Date.parse(nd);
                }
            };
            /**
             * asettaa kellon ajan kun kalenteri syötteestä poistuttaessa
             */
            $scope.pvmBlur = function () {
                $timeout(function () {
                    if ($scope.attachmentRequest.deliveryDue !== '') {
                        $scope.toimitusaika = toHHMMTime($scope.attachmentRequest.deliveryDue);
                    }
                }, 250);
            };
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

            $scope.tarkista = function () {
                $scope.liitepyyntoDialog.liitenimi.$setValidity('required', $scope.tarkistaPakollisuus($scope.attachmentRequest.header.translations));
            };

            $scope.openDatePicker = function () {
                $scope.datePicOpen = true;
            }
        }
    ]);
