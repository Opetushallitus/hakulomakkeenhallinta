angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('ValidatorsCtrl',[ '$scope', '$rootScope', 'AlertMsg',
        function ($scope, $rootScope, AlertMsg ) {
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

        }]);
