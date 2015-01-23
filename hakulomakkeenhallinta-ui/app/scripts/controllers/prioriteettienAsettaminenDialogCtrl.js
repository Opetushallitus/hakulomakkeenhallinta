angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('prioriteettienAsettaminenDialogCtrl', function ($rootScope, $scope, $modalInstance, hakukohteet, _) {

        $scope.hakukohteet = hakukohteet;

        console.log('## ',hakukohteet);

        $scope.tallennaPrioriteetit = function () {
          console.log('Tähän prioriteettien tallennusta');
        };
        /**
         * siirretaan hakukohteen prioriteettiä ylemmälle
         * prioriteetille
         * @param hakukohde
         */
        $scope.movePriorityUp = function (hakukohde, level) {
            console.log('UP', hakukohde, level);
            if (level === 'priorityundefined') {
                if ($scope.hakukohteet[1] === undefined) {
                    $scope.hakukohteet[1] = [];
                }
                $scope.hakukohteet['priorityundefined'] = _.without($scope.hakukohteet['priorityundefined'], hakukohde);
                $scope.hakukohteet[1].push(hakukohde);
            }
            /*var prioriteetti = hakukohde.prioriteetti;

            hakukohde.prioriteetti = hakukohde.prioriteetti + 1;
            $scope.hakukohteet[prioriteetti + 1].push(hakukohde);*/
            console.log($scope.hakukohteet);
        };
        /**
         * siirretään hakukohteen prioriteettia alemmalle
         * prioriteetille
         * @param hakukohde
         */
        $scope.movePriorityDown = function (hakukohde, level) {
            console.log('DOWN', hakukohde.prioriteetti);
            var prioriteetti = hakukohde.prioriteetti;
            $scope.hakukohteet[prioriteetti] = _.without($scope.hakukohteet[prioriteetti], hakukohde);
            hakukohde.prioriteetti = hakukohde.prioriteetti - 1;
            $scope.hakukohteet[prioriteetti - 1].push(hakukohde);
        };

        $scope.lisaaPrioriteetti = function () {
            console.log($scope.hakukohteet);
            //$scope.hakukohteet[] = [];
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