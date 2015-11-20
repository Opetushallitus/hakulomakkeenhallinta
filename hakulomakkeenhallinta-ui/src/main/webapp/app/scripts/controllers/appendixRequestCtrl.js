'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('AppendixRequestCtrl', ['$scope', '$modalInstance', 'attachmentRequest',
        function($scope, $modalInstance, attachmentRequest) {
            $scope.attachmentRequest = attachmentRequest;

            $scope.modify = false;
            $scope.lisaaCliked = false;

            if ($scope.attachmentRequest.deliveryDue  !== undefined) {
                $scope.modify = true;
            }

            /**
             * tallentaa liitepyynnön ja sulkee liitepyyntö dialogin
             * @param valid
             */
            $scope.tallennaLiitepyynto = function () {
                $scope.lisaaCliked = true;
                if ($scope.liitepyyntoDialog.$valid) {
                    $modalInstance.close($scope.attachmentRequest);
                }
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

            $scope.tarkista = function () {
                $scope.liitepyyntoDialog.liitenimi.$setValidity('required', $scope.tarkistaPakollisuus($scope.attachmentRequest.header.translations));
            };
        }
    ]);
