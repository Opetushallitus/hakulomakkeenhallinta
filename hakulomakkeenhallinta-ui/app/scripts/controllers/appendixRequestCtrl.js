'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('AppendixRequestCtrl',[ '$scope', '$rootScope', '$modalInstance', '$location', '$routeParams', 'hakukohde', 'option',
        function ($scope, $rootScope, $modalInstance, $location, $routeParams, hakukohde, option) {
            $rootScope.LOGS('AppendixRequestCtrl');
            $scope.organisaatio ={};
            $scope.liitePyynto ={};
            $scope.option = option;
            $scope.hakukohde =  hakukohde;
            $scope.liitePyynto.osoite = hakukohde.liitteidenToimitusOsoite.osoiterivi1;
            $scope.liitePyynto.postinumero = hakukohde.liitteidenToimitusOsoite.postinumero;
            $scope.liitePyynto.postitoimipaikka = hakukohde.liitteidenToimitusOsoite.postitoimipaikka;

            console.log(hakukohde);
            console.log(option);

            $scope.tallennaLiitepyynto = function() {
                $rootScope.LOGS('AppendixRequestCtrl','tallennaLiitepyynto()');
                $modalInstance.close('tallenne');
            };

            $scope.cancel = function() {
                $modalInstance.dismiss('cancel');
            };

        }]);
