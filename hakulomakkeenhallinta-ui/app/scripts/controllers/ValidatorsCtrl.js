angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('ValidatorsCtrl',[ '$scope', '$rootScope', 'AlertMsg', '$modal',
        function ($scope, $rootScope, AlertMsg, $modal ) {
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

            $scope.addAppendixRequest = function(hakukohde, option){
                console.log('tässä avataan dialogi liitepyynnölle');
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
                });
            };
        }]);
