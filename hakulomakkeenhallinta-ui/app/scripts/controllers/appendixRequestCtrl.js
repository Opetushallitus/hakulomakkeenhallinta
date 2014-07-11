'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('AppendixRequestCtrl',[ '$scope', '$rootScope', '$modalInstance', '$location', '$routeParams', 'hakukohde', 'option', 'Koodisto','$filter',
        function ($scope, $rootScope, $modalInstance, $location, $routeParams, hakukohde, option, Koodisto, $filter) {
            $rootScope.LOGS('AppendixRequestCtrl');
            $scope.organisaatio ={};
            $scope.liitePyynto ={};
            $scope.liitePyynto.id = option.id;
            $scope.liitePyynto.liitenimi ={};
            $scope.liitePyynto.liitekuvaus ={};
            $scope.liitePyynto.toimitusmennessa ={};
            $scope.option = option;
            $scope.hakukohde =  hakukohde;
            setHakukohdeToimitusOsoite();
            $scope.toimitusosoiteFlag = true;
            $scope.toimitusmuu = true;
            console.log(hakukohde);
            console.log(option);
            $scope.tallennaClicked = false;
            $scope.tanaan = new Date();
            var vuosiPvm = new Date();
            vuosiPvm.setFullYear(vuosiPvm.getFullYear() + 1 );
            $scope.vuosi = vuosiPvm;
            console.log($scope.tanaan, $scope.vuosi);
        /*  Koodisto.getPostiKoodit().then(function(data){
                    console.log('Saatiin koodisto',data);
                });*/
            $scope.tallennaLiitepyynto = function(valid) {
                $rootScope.LOGS('AppendixRequestCtrl','tallennaLiitepyynto()', valid);
                $scope.tallennaClicked = true;
                if(valid){
                    $modalInstance.close($scope.liitePyynto);
                }
            };

            $scope.cancel = function() {
                $modalInstance.dismiss('cancel');
            };
            /**
             * radio napeilla tapahtuva liitteiden toimitus osoite
             * @param value
             */
            $scope.liiteidenToimitusOsoite = function(value){
                switch (value){
                    case 0:
                        $scope.toimitusosoiteFlag = true;
                        $scope.toimitusmuu = true;
                        setHakukohdeToimitusOsoite();
                        break;
                    case 1:
                        $scope.toimitusosoiteFlag = false;
                        kaytaRyhmanToimitusOsoitetta();
                        break;
                    case 2:
                        $scope.toimitusosoiteFlag = true;
                        $scope.toimitusmuu = false;
                        setHakukohdeToimitusOsoite();
                        break;
                }
            }

            function setHakukohdeToimitusOsoite(){
                console.log('setHakukohdeToimitusOsoite()');
                $scope.liitePyynto.address ={};
                if(hakukohde.liitteidenToimitusOsoite){
                    $scope.liitePyynto.address.osoite = hakukohde.liitteidenToimitusOsoite.osoiterivi1;
                    $scope.liitePyynto.address.postinumero = hakukohde.liitteidenToimitusOsoite.postinumero.slice(6);
                    $scope.liitePyynto.address.postitoimipaikka = hakukohde.liitteidenToimitusOsoite.postitoimipaikka;
                }else{
                    $scope.liitePyynto.address.osoite;
                    $scope.liitePyynto.address.postinumero;
                    $scope.liitePyynto.address.postitoimipaikka;
                }

            }

            function kaytaRyhmanToimitusOsoitetta(){
                $scope.liitePyynto.address = {};
                $scope.liitePyynto.address.kaytaryhmanOsoitetta = true;
            }

        }]);
