angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('prioriteettienAsettaminenDialogCtrl',
    function ($rootScope, $scope, $modalInstance, hakukohteet, _, ryhmaOid, TarjontaAPI, AlertMsg, LocalisationService, ApplicationFormConfiguration) {

        $scope.hakukohteet = _.clone(hakukohteet);
        var priorityKeys = _.keys(hakukohteet);
        $scope.autentikoitu = false;

        TarjontaAPI.checkTarjontaAuthentication().then(
            function success (data) {
                $scope.autentikoitu = true;
                $rootScope.LOGS('Tarkistetaan autentikaatio Tarjontaa success', data);
            },
            function error (resp) {
                $rootScope.LOGS('Ei oikeutta tarjontaan error', resp);
                $scope.autentikoitu = false;
                AlertMsg($scope, 'warning', 'warning.autenkikaatio.ei.onnistunut.tai.puutuvat.oikeudet.tarjonta.palvelu');
            }
        );
        /**
         * siirretaan hakukohteen prioriteettiä ylemmälle
         * prioriteetille
         * @param hakukohde
         */
        $scope.movePriorityUp = function (hakukohde, priority) {
            if (priority === 'priorityundefined') {
                var prios = _.without(priorityKeys, 'priorityundefined');
                prios = _.sortBy(prios, function(priority) {return parseInt(priority)});
                var last = _.last(prios);
                if ($scope.hakukohteet[1] === undefined) {
                    $scope.hakukohteet[1] = [];
                    $scope.hakukohteet['priorityundefined'] = _.without($scope.hakukohteet['priorityundefined'], hakukohde);
                    $scope.hakukohteet[1].push(hakukohde);
                    priorityKeys = _.keys($scope.hakukohteet);
                } else {
                    $scope.hakukohteet['priorityundefined'] = _.without($scope.hakukohteet['priorityundefined'], hakukohde);
                    $scope.hakukohteet[parseInt(last)].push(hakukohde);
                }
            } else {
                $scope.hakukohteet[priority] = _.without($scope.hakukohteet[priority], hakukohde);
                if ($scope.hakukohteet[parseInt(priority) - 1] === undefined) {
                    $scope.hakukohteet[parseInt(priority) - 1] = [];
                }
                $scope.hakukohteet[parseInt(priority) - 1].push(hakukohde);
            }
        };
        /**
         * siirretään hakukohteen prioriteettia alemmalle
         * prioriteetille
         * @param hakukohde
         */
        $scope.movePriorityDown = function (hakukohde, priority) {
            var prios = _.without(priorityKeys, 'priorityundefined');
            prios = _.sortBy(prios, function(priority) {return parseInt(priority)});
            var last = _.last(prios);
            if(parseInt(last) === parseInt(priority)) {
                $scope.hakukohteet[priority] = _.without($scope.hakukohteet[priority], hakukohde);
                if ($scope.hakukohteet['priorityundefined'] === undefined) {
                    $scope.hakukohteet['priorityundefined'] = [];
                }
                $scope.hakukohteet['priorityundefined'].push(hakukohde);
            } else {
                if ($scope.hakukohteet[parseInt(priority) + 1] === undefined) {
                    $scope.hakukohteet[parseInt(priority) + 1] = [];
                }
                $scope.hakukohteet[priority] = _.without($scope.hakukohteet[priority], hakukohde);
                $scope.hakukohteet[parseInt(priority) + 1].push(hakukohde);
            }
        };
        /**
         * lisätään uusi prioriteetti käyttöliittymään
         */
        $scope.lisaaPrioriteetti = function () {
            var prios = _.without(priorityKeys, 'priorityundefined');
            prios = _.sortBy(prios, function(priority) {return parseInt(priority)});
            var last = _.last(prios);
            if (last === undefined) {
                $scope.hakukohteet[1] = [];
            } else {
                $scope.hakukohteet[parseInt(last) + 1] = [];
            }
            priorityKeys = _.keys($scope.hakukohteet);
        };
        /**
         * Tallennetaan asetetut prioriteetit
         * hakukohderyhmässä oleviin hakukohteisiin.
         * Tallennus paikkana tarjonta
         */
        $scope.tallennaPrioriteetit = function () {
            var saveArray = [];
            _.each($scope.hakukohteet, function (hakukohteet, priority){
                _.each(hakukohteet, function(hakukohde) {
                    var hkPrio = {};
                    hkPrio.hakukohdeOid = hakukohde.oid;
                    if (priority !== 'priorityundefined') {
                        hkPrio.prioriteetti = priority;
                    }
                    saveArray.push(hkPrio);
                })
            });
            ApplicationFormConfiguration.asetaHakukohdePrioriteetit(ryhmaOid, saveArray).then(
                function success (data) {
                    $modalInstance.close();
                },
                function error(resp) {
                    AlertMsg($scope, 'error', 'error.tallennus.epaonnistui');
                }
            );
        };
        /**
         * suljetaan dialogi ilman muutosten tallennusta
         */
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
        $scope.t = function (key) {
            return LocalisationService.tl(key);
        };
    }
);