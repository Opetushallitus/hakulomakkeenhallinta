'use strict'

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('LisaaHakukohdeRyhmaanDialogCtrl',
    function ($scope, $rootScope, TarjontaAPI, Organisaatio, _, $routeParams, $modalInstance, hakukohdeRyhma, AlertMsg, $filter) {
        $scope.hakukohdeRyhma = hakukohdeRyhma;
        $scope.hakukohteet = [];
        var lisattavatHakukohteet = [];
        TarjontaAPI.usersApplicationOptions($routeParams.id, Organisaatio.getUserSelectedOrganisation().oid).then(
            function (data) {
                if (data.length === 0) {
                    AlertMsg($scope, 'warning', 'organisaatiossa.ei.hakukohdetta.hakukohdejoukko');
                } else {
                    $scope.hakukohteet = _.chain(data)
                        .map(function (data) {
                            _.each(data.tulokset, function (tulos) {
                                tulos.tarjoaja = {};
                                tulos.tarjoaja.nimi = data.nimi;
                            });
                            return data.tulokset;
                        })
                        .flatten()
                        .value();
                    $scope.hakukohteet = $filter('orderBy')($scope.hakukohteet, 'nimi.' + $scope.userLang, false);
                }
            }
        );
        $scope.paivitaLisattavienListaa = function (oid, hkchecked) {
            console.log('$scope ', hkchecked, oid);
            if (hkchecked) {
                lisattavatHakukohteet.push(oid);
            } else {
                lisattavatHakukohteet = _.without(lisattavatHakukohteet, oid);
            }
            console.log('### ', lisattavatHakukohteet);
        };
        /**
         * Lisätään valitut hakukohteet
         * valittuun hakukohderyhmään
         * data tallennetaan tarjontaan
         */
        $scope.lisaaHakukohteetRyhmaan = function () {

            if(lisattavatHakukohteet.length !== 0) {
                TarjontaAPI.lisaaHakukohteetRyhmaan(hakukohdeRyhma, lisattavatHakukohteet).then(
                    function (data) {
                        console.log('^^^^ ',data);
                    }
                );
            }
        };

        /**
         * Suljetaan dialogi
         */
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

    }
);