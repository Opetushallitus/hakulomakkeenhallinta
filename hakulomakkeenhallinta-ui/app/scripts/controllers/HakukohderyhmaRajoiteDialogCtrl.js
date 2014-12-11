'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('HakukohderyhmaRajoiteDialogCtrl', [ '$rootScope', '$scope', '$modalInstance', 'TarjontaAPI', 'applicationForm', 'Organisaatio', 'AlertMsg', 'rajoitetutRyhmat', '$routeParams', '_', 'ApplicationFormConfiguration',
        function ($rootScope, $scope, $modalInstance, TarjontaAPI, applicationForm, Organisaatio, AlertMsg, rajoitetutRyhmat, $routeParams, _, ApplicationFormConfiguration) {
            $rootScope.LOGS('HakukohderyhmaRajoiteDialogCtrl');

            $scope.hakukohdeRyhmat = [];
            $scope.applicationForm = applicationForm;
            $scope.hakukohderyhma = '';

            $scope.$emit('LOAD');
            TarjontaAPI.usersApplicationOptionGroups($routeParams.id, Organisaatio.getUserSelectedOrganisation().oid).then(
                function (data) {
                    $scope.$emit('LOADREADY');
                    if (data.length === 0) {
                        AlertMsg($scope, 'warning', 'valitulla.organisaatiolla.ei.tassa.hakulomakkeella.ole.hakukohderyhmia');
                    } else {
                        var rajoitetut = [];
                        _.each(rajoitetutRyhmat, function (rj) {
                            rajoitetut.push(_.findWhere(data, {oid: rj.groupId}));
                        });
                        data = _.filter(data, function (rajaava) { return _.contains(rajaava.kayttoryhmat, 'hakukohde_rajaava'); });

                        $scope.hakukohdeRyhmat =  _.difference(data, rajoitetut);
                        if ($scope.hakukohdeRyhmat.length === 0) {
                            AlertMsg($scope, 'warning', 'lomakkeen.hakukohteilla.ei.rajaavia.ryhmia');
                        }
                    }
                }
            );
            /**
             * Haetaan valitusta hakukohderyhmästä tietoja
             * Dialogiin
             */
            $scope.hakukohdeRyhmaValittu = function () {
                TarjontaAPI.haeRyhmanHakukohteet($scope.hakukohderyhma.oid).then(
                    function (data) {
                        $scope.hakukohteidenMaara = data.tuloksia;
                    }
                );
            };
            /**
             * Tallennetaan hakukohderyhmään hakukohde rajaus
             * @param hakukohdeRyhmaOid
             * @param hakukohdeRajoite
             */
            $scope.tallennaHakukohdeRajaus = function (hakukohdeRyhmaOid, hakukohdeRajoite) {
                if (hakukohdeRajoite > $scope.hakukohteidenMaara) {
                    $scope.hakuryhmanRajoite.rajoite.$error.max = true;
                } else if (hakukohdeRajoite !== undefined) {
                    //TODO: tähän tallenus kun back end valmis
                    ApplicationFormConfiguration.tallennaHakukohderyhmaRajoite($routeParams.id, hakukohdeRyhmaOid, hakukohdeRajoite).then(
                        function success(data) {
                            AlertMsg($scope, 'success', 'tallennus.ok');
                            //TODO: poista tämä kun back end valmis
                            $modalInstance.close(
                                {
                                    groupId: hakukohdeRyhmaOid,
                                    type: 'restriction',
                                    configuration: {
                                        maxSelection: hakukohdeRajoite
                                    }
                                }
                            );
                        },
                        function error(resp) {
                            AlertMsg($scope, 'error', 'error.tallennus.epaonnistui');
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

        }]);
