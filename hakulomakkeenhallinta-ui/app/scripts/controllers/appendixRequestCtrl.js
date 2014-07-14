
'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('AppendixRequestCtrl',[ '$scope', '$rootScope', '$modalInstance', '$location', '$routeParams', 'hakukohde', 'option', 'Koodisto','$filter','LiitepyyntoData',
        function ($scope, $rootScope, $modalInstance, $location, $routeParams, hakukohde, option, Koodisto, $filter, LiitepyyntoData) {
            $rootScope.LOGS('AppendixRequestCtrl');
            $scope.organisaatio ={};
            $scope.tallennaClicked = false;
            $scope.option = option;
            $scope.hakukohde =  hakukohde;
            $scope.toimitusosoiteFlag = true;

            if(LiitepyyntoData.getEditFlag()){
                $scope.liitePyynto = LiitepyyntoData.getLiitepyynto();
                if($scope.liitePyynto.address.kaytaryhmanOsoitetta){
                    $scope.toimitusosoiteFlag = false;
                }
            }else{
                $scope.liitePyynto = LiitepyyntoData.createNewLiitepyynto(option.id);
                setHakukohdeToimitusOsoite();
            }

            $scope.tanaan = new Date();
            var vuosiPvm = new Date();
            vuosiPvm.setFullYear(vuosiPvm.getFullYear() + 1 );
            $scope.vuosi = vuosiPvm;

            $scope.postiKoodit = [];
            /**
             * haetaan postinumerot ja postitoimipaikat'
             * Koodistosta
             */
            Koodisto.getPostiKoodit().then(function(data){
                $scope.postiKoodit = data;
            });

            /**
             * tallentaa liitepyynnön ja sulkee liitepyyntö dialogin
             * @param valid
             */
            $scope.tallennaLiitepyynto = function(valid) {
                $rootScope.LOGS('AppendixRequestCtrl','tallennaLiitepyynto()', valid);
                $scope.tallennaClicked = true;
                if(valid){
                    LiitepyyntoData.setEditFlag(false);
                    $modalInstance.close($scope.liitePyynto);
                }
            };

            $scope.cancel = function() {
                LiitepyyntoData.setEditFlag(false);
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
                        setHakukohdeToimitusOsoite();
                        break;
                    case 1:
                        $scope.toimitusosoiteFlag = false;
                        kaytaRyhmanToimitusOsoitetta();
                        break;
                }
            };
            /**
             * asettaa liitepyyntö olioon liitteen toimitus osoitteen
             */
            function setHakukohdeToimitusOsoite(){
                $rootScope.LOGS('setHakukohdeToimitusOsoite()');
                $scope.liitePyynto.address = {};
                if(hakukohde.liitteidenToimitusOsoite){
                    $scope.liitePyynto.address.osoite = hakukohde.liitteidenToimitusOsoite.osoiterivi1;
                    $scope.liitePyynto.address.postinumero = hakukohde.liitteidenToimitusOsoite.postinumero.slice(6);
                    $scope.liitePyynto.address.postitoimipaikka = hakukohde.liitteidenToimitusOsoite.postitoimipaikka;
                }else{
                    $scope.liitePyynto.address.osoite;
                    $scope.liitePyynto.address.postinumero;
                    $scope.liitePyynto.address.postitoimipaikka;
                }

            };
            /**
             * asettaa liitepyyntö olioon liitteen toimitus osoitteen
             * tiedon käyttää hakukohteen ryhmän osoitetta
             */
            function kaytaRyhmanToimitusOsoitetta(){
                $scope.liitePyynto.address = {};
                $scope.liitePyynto.address.kaytaryhmanOsoitetta = true;
            };
            /**
             * asettaa postitoimi paikan valitulla postinumerolla
             */
            $scope.setPostitoimipaikka = function(){
                $rootScope.LOGS('setPostitoimipaikka() postiNro: ', $scope.liitePyynto.address.postinumero);
                for(var ptn in $scope.postiKoodit){
                    if($scope.postiKoodit[ptn].koodiArvo === $scope.liitePyynto.address.postinumero){
                        $scope.liitePyynto.address.postitoimipaikka = $scope.postiKoodit[ptn].metadata[0].nimi;
                        return;
                    }
                }
            };

        }]);
