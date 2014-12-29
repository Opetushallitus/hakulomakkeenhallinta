angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('prioriteettienAsettaminenDialogCtrl', function ($rootScope, $scope, $modalInstance, hakukohteet) {


        $scope.tallennaPrioriteetit = function () {
          console.log('Tähän prioriteettien tallennusta');
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
);
