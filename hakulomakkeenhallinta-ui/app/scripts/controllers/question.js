'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
.controller('QuestionCtrl', ['$scope', '$rootScope', '$modal', '_', 'QuestionData',
    function($scope, $rootScope, $modal, _ , QuestionData) {
        $rootScope.LOGS('QuestionCtrl '+6);
        /*var question = QuestionData.getQuestion();
        var editFlag = QuestionData.getEditFlag();
        console.log(question.type);
        switch(question.type){
            case 'TextQuestion':

                $scope.validators = QuestionData.getTextQuestionValidators();
                break;

            case 'CheckBox':

                if(!editFlag){
                    question.options = [];
                    var optionObj = {};
                    optionObj.optionText ={};
                    optionObj.optionText.translations = {};
                    optionObj.id = 'option_0';
                    question.options[0] = optionObj;
                }
                $scope.validators = QuestionData.getCheckboxValidators();
                break;

            case 'RadioButton':

                if(!editFlag){
                    question.options = [];
                    var radioObj = {};
                    radioObj.optionText ={};
                    radioObj.optionText.translations = {};
                    radioObj.id = 'option_0';
                    var radioObj2 = {};
                    radioObj2.optionText = {};
                    radioObj2.optionText.translations = {};
                    radioObj2.id = 'option_1';
                    question.options[0] = radioObj;
                    question.options[1] = radioObj2;
                }
                $scope.validators = QuestionData.getRadioValidators();
                break;
        };*/

    }
]);

