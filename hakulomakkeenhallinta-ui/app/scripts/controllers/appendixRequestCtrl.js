
'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('AppendixRequestCtrl',[ '$scope', '$rootScope', '$modalInstance', '$location', '$routeParams', 'hakukohde', 'option', 'Koodisto','$filter','LiitepyyntoData', '$timeout',
        function ($scope, $rootScope, $modalInstance, $location, $routeParams, hakukohde, option, Koodisto, $filter, LiitepyyntoData, $timeout) {
            $rootScope.LOGS('AppendixRequestCtrl');
            $scope.tallennaClicked = false;
            $scope.option = option;
            $scope.hakukohde =  hakukohde;
            $scope.toimitusosoiteFlag = true;
            $scope.attachmentRequest = {};
            $scope.liite = {};

            if(LiitepyyntoData.getEditFlag()){
                $scope.attachmentRequest = LiitepyyntoData.getLiitepyynto();
                localStorage.setItem('attachmentRequest', JSON.stringify($scope.attachmentRequest));
                if($scope.attachmentRequest.useGroupAddress){
                    $scope.toimitusosoiteFlag = false;
                }
                $scope.liite.toimitusAika = toHHMMTime($scope.attachmentRequest.deliveryDue);
            }else{
                $scope.attachmentRequest = LiitepyyntoData.createNewLiitepyynto(option.id);
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
                    if(localStorage.getItem('attachmentRequest') !== undefined){
                        localStorage.removeItem('attachmentRequest');
                    }
                    $modalInstance.close($scope.attachmentRequest);
                }
            };

            $scope.cancel = function() {
                if(LiitepyyntoData.getEditFlag()){
                    $scope.attachmentRequest = JSON.parse(localStorage.getItem('attachmentRequest'));
                    localStorage.removeItem('attachmentRequest');
                    LiitepyyntoData.setEditFlag(false);
                    $modalInstance.close($scope.attachmentRequest);
                }else{
                    $modalInstance.dismiss('cancel');
                }

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
                delete $scope.attachmentRequest.useGroupAddress;
                $scope.attachmentRequest.deliveryAddress = {};
                if(hakukohde.liitteidenToimitusOsoite){
                    $scope.attachmentRequest.deliveryAddress.street = hakukohde.liitteidenToimitusOsoite.osoiterivi1;
                    $scope.attachmentRequest.deliveryAddress.postCode = hakukohde.liitteidenToimitusOsoite.postinumero.slice(6);
                    $scope.attachmentRequest.deliveryAddress.postOffice = hakukohde.liitteidenToimitusOsoite.postitoimipaikka;
                }else{
                    $scope.attachmentRequest.deliveryAddress.street;
                    $scope.attachmentRequest.deliveryAddress.postCode;
                    $scope.attachmentRequest.deliveryAddress.postOffice;
                }
            };
            /**
             * asettaa liitepyyntö olioon liitteen toimitus osoitteen
             * tiedon käyttää hakukohteen ryhmän osoitetta
             */
            function kaytaRyhmanToimitusOsoitetta(){
                delete $scope.attachmentRequest.deliveryAddress;
                $scope.attachmentRequest.useGroupAddress = true;
            };
            /**
             * asettaa postitoimi paikan valitulla postinumerolla
             */
            $scope.setPostitoimipaikka = function(){
                $rootScope.LOGS('setPostitoimipaikka() postiNro: ', $scope.attachmentRequest.deliveryAddress.postCode);
                for(var ptn in $scope.postiKoodit){
                    if($scope.postiKoodit[ptn].koodiArvo === $scope.attachmentRequest.deliveryAddress.postCode){
                        $scope.attachmentRequest.deliveryAddress.postOffice = $scope.postiKoodit[ptn].metadata[0].nimi;
                        return;
                    }
                }
            };
            /**
             * asettaa kellon ajan päivä objetiin
             */
            $scope.setKellonaikaToDate = function(){
                if($scope.liite.toimitusAika !== undefined && $scope.attachmentRequest.deliveryDue !== ''){
                    var dmsec = Date.parse($scope.attachmentRequest.deliveryDue),
                        d = new Date(dmsec),
                        t =  $scope.liite.toimitusAika;
                    var nd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), t.substr(0,2), t.substr(3,2));
                    $scope.attachmentRequest.deliveryDue = nd;
                }
            };
            /**
             * asettaa kellon ajan kun kalenteri syötteestä poistuttaessa
             */
            $scope.pvmBlur = function(){
                $timeout(function(){
                    if($scope.attachmentRequest.deliveryDue !== ''){
                        $scope.liite.toimitusAika = toHHMMTime($scope.attachmentRequest.deliveryDue);
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
