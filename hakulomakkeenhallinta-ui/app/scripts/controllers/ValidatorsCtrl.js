angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('ValidatorsCtrl',[ '$scope', '$rootScope', 'AlertMsg',
        function ($scope, $rootScope, AlertMsg ) {
            /**
             * lisää valintaruudun kysymykseen
             * @param question
             */
            $scope.addCheckbox = function(question){
                var optionObj = {};
                var qIndx = question.options.length;
                optionObj.optionText = {}
                optionObj.optionText.translations = {};
                optionObj.id = 'option_'+qIndx;
                question.options[qIndx] = optionObj;
            };
            /**
             * poistaa valintaruudun kysymyksestä
             * @param indx
             * @param question
             */
            $scope.removeCheckbox = function(indx, question){
                if(question.options.length >1 ){
                    question.options.splice(indx ,1);
                }
                for(var optionIndx in question.options){
                    question.options[optionIndx].id = 'option_'+optionIndx;
                }
            };
            /**
             * Lisää valintanapin kysymykseen
             * @param question
             */
            $scope.addRadio = function(question){
                var optionObj = {};
                var qIndx = question.options.length;
                optionObj.optionText = {};
                optionObj.optionText.translations = {};
                optionObj.id = 'option_'+qIndx;
                question.options[qIndx] = optionObj;

            };
            /**
             * Poistaa valintanapin kysymyksestä
             * @param indx
             * @param question
             */
            $scope.removeRadio = function(indx, question){
                if(question.options.length >2 ){
                    question.options.splice(indx ,1);
                }
                for(var optionIndx in question.options){
                    question.options[optionIndx].id = 'option_'+optionIndx;
                }
            };
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
