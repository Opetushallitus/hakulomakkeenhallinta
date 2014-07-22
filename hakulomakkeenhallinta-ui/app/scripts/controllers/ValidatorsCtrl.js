angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('ValidatorsCtrl',[ '$scope', '$rootScope', 'AlertMsg', '$modal', 'LiitepyyntoData',
        function ($scope, $rootScope, AlertMsg, $modal, LiitepyyntoData ) {
            /**
             * lisää kysymykseen minimi vastausten arvon
             * @param question
             * @param value
             */
            $scope.minValueValidator = function(question, value){
                if(question.validators === undefined){
                    question.validators = [];
                }else{
                    $rootScope.LOGS('createAdditionalQuestion', 'minValueValidator()', $scope.validatorMin );
                    $rootScope.LOGS('createAdditionalQuestion', 'minValueValidator()', value );
                    var min = {};
                    min.min = value;
                    question.validators[0] = min
                }
            };
            /**
             * lisää kysymyksen maxmimi vastausten arvon
             * @param question
             * @param value
             */
            $scope.maxValueValidator = function(question, value){
                if(question.validators === undefined){
                    question.validators = [];
                }else{
                    var max = {};
                    max.max = value;
                    question.validators[1] = max;
                }
            };
            /**
             * avaa liitekysmys dialogin kysymykselle
             * @param hakukohde hakukohteen tiedot liitpyynnölle
             * @param option kysymyksen tiedot liitepyynnölle
             */
            $scope.addAppendixRequest = function(hakukohde, option){
                $modal.open({
                    templateUrl: 'partials/lisakysymykset/liitepyynto.html',
                    controller: 'AppendixRequestCtrl',
                    scope: $scope,
                    resolve: {
                        hakukohde: function(){
                            return hakukohde;
                        },
                        option: function(){
                            return option;
                        }
                    }
                }).result.then(function(data){
                        if($scope.question.attachmentRequests === undefined){
                            $scope.question.attachmentRequests = [];
                        }
                        $scope.question.attachmentRequests[$scope.question.attachmentRequests.length] = data;
                    });
            };
            /**
             * liitepyynnön poisto kysymyksestä
             * @param index kysymyksen indx, joka on liitetty liitepyyntöön
             */
            $scope.removeAppendixRequest = function(index){
                for(var li in $scope.question.attachmentRequests){
                    if($scope.question.attachmentRequests[li].attachedToOptionId === 'option_'+index){
                        $scope.question.attachmentRequests.splice(li,1);
                    }
                }
                if($scope.question.attachmentRequests.length === 0){
                    delete $scope.question.attachmentRequests;
                }
            };
            /**
             * avaa liitepyynnön muokkaus dialogin kysymyksen liitepynnölle
             * @param hakukohde hakukohteen tiedot liitepyynnölle
             * @param option kysymyksen tiedot liitepyynnölle
             */
            $scope.modifyAppendixRequest = function(hakukohde, option){
                for(var lip in $scope.question.attachmentRequests){
                    if($scope.question.attachmentRequests[lip].attachedToOptionId === option.id){
                        LiitepyyntoData.setLiitepyynto($scope.question.attachmentRequests[lip]);
                    }
                }
                $modal.open({
                    templateUrl: 'partials/lisakysymykset/liitepyynto.html',
                    controller: 'AppendixRequestCtrl',
                    scope: $scope,
                    resolve: {
                        hakukohde: function(){
                            return hakukohde;
                        },
                        option: function(){
                            return option;
                        }
                    }
                }).result.then(function(data){
                        for (var atcrq in $scope.question.attachmentRequests) {
                            if($scope.question.attachmentRequests[atcrq].attachedToOptionId === data.attachedToOptionId){
                                $scope.question.attachmentRequests[atcrq] = data;
                                return;
                            }
                        }
                    });
            };
            /**
             * tarkistaa ui:ssa onko kysymykseen liitetty liitepyyntö
             * @param index kysymyksen index, joka on liitetty liitepyyntöön
             * @returns {boolean}
             */
            $scope.hasLiitepyynto = function(index){
                if($scope.question.attachmentRequests !== undefined && JSON.stringify($scope.question.attachmentRequests).indexOf('option_'+index) > -1){
                   return true;
                }
                return false;
            };
        }]);
