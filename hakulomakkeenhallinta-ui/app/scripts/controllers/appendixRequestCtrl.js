
'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('AppendixRequestCtrl',[ '$scope', '$rootScope', '$modalInstance', '$location', '$routeParams', 'hakukohde', 'option', 'Koodisto','$filter','LiitepyyntoData', '$timeout',
        function ($scope, $rootScope, $modalInstance, $location, $routeParams, hakukohde, option, Koodisto, $filter, LiitepyyntoData, $timeout) {
            $rootScope.LOGS('AppendixRequestCtrl');
            $scope.organisaatio ={};
            $scope.tallennaClicked = false;
            $scope.option = option;
            $scope.hakukohde =  hakukohde;
            $scope.toimitusosoiteFlag = true;
            $scope.attachmentRequests = {};
            $scope.liite = {};

            if(LiitepyyntoData.getEditFlag()){
                $scope.attachmentRequests = LiitepyyntoData.getLiitepyynto();
                if($scope.attachmentRequests.useGroupAddress){
                    $scope.toimitusosoiteFlag = false;
                }
                $scope.liite.toimitusAika = toHHMMTime($scope.attachmentRequests.deliveryDue);
            }else{
                $scope.attachmentRequests = LiitepyyntoData.createNewLiitepyynto(option.id);
                setHakukohdeToimitusOsoite();
            }


            $scope.tanaan = new Date();
            $scope.tanaan.setHours(23,59);
            var vuosiPvm = new Date();
            vuosiPvm.setFullYear(vuosiPvm.getFullYear() + 1 );
            $scope.vuosi = vuosiPvm.setHours(23, 59);

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
                    $modalInstance.close($scope.attachmentRequests);
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
                delete $scope.attachmentRequests.useGroupAddress;
                $scope.attachmentRequests.deliveryAddress = {};
                if(hakukohde.liitteidenToimitusOsoite){
                    $scope.attachmentRequests.deliveryAddress.street = hakukohde.liitteidenToimitusOsoite.osoiterivi1;
                    $scope.attachmentRequests.deliveryAddress.postCode = hakukohde.liitteidenToimitusOsoite.postinumero.slice(6);
                    $scope.attachmentRequests.deliveryAddress.postOffice = hakukohde.liitteidenToimitusOsoite.postitoimipaikka;
                }else{
                    $scope.attachmentRequests.deliveryAddress.street;
                    $scope.attachmentRequests.deliveryAddress.postCode;
                    $scope.attachmentRequests.deliveryAddress.postOffice;
                }
            };
            /**
             * asettaa liitepyyntö olioon liitteen toimitus osoitteen
             * tiedon käyttää hakukohteen ryhmän osoitetta
             */
            function kaytaRyhmanToimitusOsoitetta(){
                delete $scope.attachmentRequests.deliveryAddress;
                $scope.attachmentRequests.useGroupAddress = true;
            };
            /**
             * asettaa postitoimi paikan valitulla postinumerolla
             */
            $scope.setPostitoimipaikka = function(){
                $rootScope.LOGS('setPostitoimipaikka() postiNro: ', $scope.attachmentRequests.deliveryAddress.postinumero);
                for(var ptn in $scope.postiKoodit){
                    if($scope.postiKoodit[ptn].koodiArvo === $scope.attachmentRequests.deliveryAddress.postinumero){
                        $scope.attachmentRequests.deliveryAddress.postitoimipaikka = $scope.postiKoodit[ptn].metadata[0].nimi;
                        return;
                    }
                }
            };
            /**
             * asettaa kellon ajan päivä objetiin
             */
            $scope.setKellonaikaToDate = function(){
                if($scope.liite.toimitusAika !== undefined && $scope.attachmentRequests.deliveryDue !== ''){
                    var dmsec = Date.parse($scope.attachmentRequests.deliveryDue),
                        d = new Date(dmsec),
                        t =  $scope.liite.toimitusAika;
                    var nd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), t.substr(0,2), t.substr(3,2));
                    $scope.attachmentRequests.deliveryDue = nd;
                }
            };
            /**
             * asettaa kellon ajan kun kalenteri syötteestä poistuttaessa
             */
            $scope.pvmBlur = function(){
                $timeout(function(){
                    if($scope.attachmentRequests.deliveryDue !== ''){
                        $scope.liite.toimitusAika = toHHMMTime($scope.attachmentRequests.deliveryDue);
                    }
                }, 250);
            };
            /**
             * muokkaa kellon aikaa kaksi numeroiseksi merkkijonoksia
             * @param hhmm kellon ajan tunnit /minuutit
             * @returns {*} kaksinumeroisen merkkijonon kellon ajasta
             */
            function addZeros(hhmm){
                if(hhmm<10){
                    hhmm = '0'+hhmm;
                }
                return hhmm;
            }

            /**
             * parsiin kellon ajan päivä objektista
             * @param date
             * @returns {string} paluttaa kellon ajan mutoa hh:mm
             */
            function toHHMMTime(date){
                var dmsec = Date.parse(date),
                    hhmm = new Date(dmsec),
                    hh = addZeros(hhmm.getHours()),
                    mm = addZeros(hhmm.getMinutes());
                return hh+':'+mm;
            }

        }]);
