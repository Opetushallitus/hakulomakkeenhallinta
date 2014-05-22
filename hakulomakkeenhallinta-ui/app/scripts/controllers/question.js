'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
.controller('QuestionCtrl', ['$scope', '$modal', '_', 'QuestionData',
    function($scope, $modal, _ , QuestionData) {
        var question = QuestionData.getQuestion();

        switch(question.type){
            case 'TextQuestion':
                $scope.validators = QuestionData.getTextQuestionValidators();
                break;
            case 'CheckBox':
                question.options = [];
                var optionObj = {};
                optionObj.translations = {};
                optionObj._id = 'option_0';
                question.options[0] = optionObj;
                $scope.validators = QuestionData.getCheckboxValidators();
                break;

            case 'Radio':
                question.options = [];
                var radioObj = {};
                radioObj.translations = {};
                radioObj._id = 'option_0';
                var radioObj2 = {};
                radioObj2.translations = {};
                radioObj2._id = 'option_1';
                question.options[0] = radioObj;
                question.options[1] = radioObj2;
                $scope.validators = QuestionData.getRadioValidators();
                break;
        };

        $scope.addValidator = function(question) {
            var validatortypePrefix = "fi.vm.sade.haku.oppija.lomake.validation.validators.RequiredFieldValidator";
            $scope.validators.push('RequiredFieldValidator');
            var validatorIndx = 0;
            /*for(var j in $scope.validators){
                question.validators[j]._class = validatortypePrefix + $scope.validators[j];
            }*/
            console.log('QuestionCtrl', $scope.validators);
            if(question.validators === undefined){
                question.validators = [];
            }
            validatorIndx = question.validators.length;
            var validatorObject = {};
            validatorObject.errorMessage = {};
            validatorObject.errorMessage.i18nText = {};
            validatorObject.errorMessage.i18nText.translations = {};
            validatorObject._class = validatortypePrefix;
            question.validators[validatorIndx] = validatorObject;

        };
    }
]);

