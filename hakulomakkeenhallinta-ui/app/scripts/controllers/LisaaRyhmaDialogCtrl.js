'use strict';
angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('LisaaRyhmaDialogCtrl',
    function ($rootScope, $scope, $modalInstance, kayttoTarkoitus, organisaatioOid) {
        $scope.kayttoTarkoitus = kayttoTarkoitus;
        $scope.organisaatioOid = organisaatioOid;

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
);
