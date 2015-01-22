angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('LisaaPriorisoivaryhmaLomakkeenAsetuksiinDialogCtrl',
    function ($scope, $rootScope, Organisaatio, _, $routeParams, $modalInstance, applicationForm, priorisointiRyhmat, AlertMsg, ApplicationFormConfiguration, lomakepohja, LocalisationService, TarjontaService) {
        $scope.applicationForm = applicationForm;
        $scope.hakukohdeRyhmat = [];
        $scope.starLoad = true;

        Organisaatio.getPriorisoivatHakukohdeRyhmat($routeParams.oid).then(
            function (data) {
                var valittavissaOlevatRyhmat = [];
                // poistetaan valinta listasta jo lomakkeen asetuksissa käytössä olevat
                // hakukohderyhmat
                var kaytossaOlevatOidit = _.pluck(priorisointiRyhmat, 'oid');
                _.each(data, function(ryhma) {
                    if(!_.contains(kaytossaOlevatOidit, ryhma.oid)) {
                        valittavissaOlevatRyhmat.push(ryhma);
                    }
                });
                $scope.$emit('LOADREADY');
                $scope.hakukohdeRyhmat = valittavissaOlevatRyhmat;
                if (valittavissaOlevatRyhmat.length === 0) {
                    AlertMsg($scope, 'warning', 'ei.valittavia.hakukohderyhmia.tai.ne.kaikki.ovat.jo.kaytossa');
                }
            }
        );
        /**
         * avataan dialogi velho priorisoivan hakukohde ryhmän liittämiseksi
         * lomakepohjan asetuksiin. Valittuun ryhmään täytyy liittää
         * vähintään yksi hakukohde hausta, jotta priorisoiva hakukohde
         * ryhmä voidaan sitoa lomakkeen pohjan asetuksiin. Tiedon tallennus paikka
         * on tarjonta palvelu.
         */
        $scope.lisaaPriorisoivaryhmaLomakkeenAsetuksiin = function () {
                $modalInstance.close();
                TarjontaService.lisaaHakukohdeRyhmaan($scope.hakukohderyhma, $scope.userLang);
        };
        /**
         * Suljetaan dialogi
         */
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
        $scope.t = function (key) {
            return LocalisationService.tl(key);
        };
    }
);
