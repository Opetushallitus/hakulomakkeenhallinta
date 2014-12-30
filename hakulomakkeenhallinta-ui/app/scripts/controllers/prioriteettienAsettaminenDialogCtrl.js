angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('prioriteettienAsettaminenDialogCtrl', function ($rootScope, $scope, $modalInstance, hakukohteet, _) {

        $scope.hakukohteet = hakukohteet;

        $scope.tallennaPrioriteetit = function () {
          console.log('Tähän prioriteettien tallennusta');
        };
        /**
         * siirretaan hakukohteen prioriteettiä ylemmälle
         * prioriteetille
         * @param hakukohde
         */
        $scope.movePriorityUp = function (hakukohde) {
            console.log('UP', hakukohde.prioriteetti);
            var prioriteetti = hakukohde.prioriteetti;
            $scope.hakukohteet[prioriteetti] = _.without($scope.hakukohteet[prioriteetti], hakukohde);
            hakukohde.prioriteetti = hakukohde.prioriteetti + 1;
            $scope.hakukohteet[prioriteetti + 1].push(hakukohde);
        };
        /**
         * siirretään hakukohteen prioriteettia alemmalle
         * prioriteetille
         * @param hakukohde
         */
        $scope.movePriorityDown = function (hakukohde) {
            console.log('DOWN', hakukohde.prioriteetti);
            var prioriteetti = hakukohde.prioriteetti;
            $scope.hakukohteet[prioriteetti] = _.without($scope.hakukohteet[prioriteetti], hakukohde);
            hakukohde.prioriteetti = hakukohde.prioriteetti - 1;
            $scope.hakukohteet[prioriteetti - 1].push(hakukohde);
        };

        $scope.tallennaPrioriteetit = function () {
            $modalInstance.close($scope.hakukohteet);
        };
        /**
         * suljetaan dialogi ilman muutosten tallennusta
         */
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
);