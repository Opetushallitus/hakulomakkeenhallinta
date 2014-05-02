'use strict';

angular.module('hakulomakkeenhallintaUiApp')
    .controller('KoodistoCtrl', ['$scope', 'Koodisto',
        function($scope, Koodisto) {

            Koodisto.getKoodistot().then(function(koodistot) {
                $scope.koodistot = koodistot;
            });

            $scope.getKoodisto = function() {
                Koodisto.getKoodisto($scope.selectedKoodisto.id).then(function(koodisto) {
                    $scope.koodisto = koodisto;
                });
            };
        }
    ]);
