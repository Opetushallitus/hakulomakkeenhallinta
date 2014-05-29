'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
.controller('QuestionCtrl', ['$scope', '$modal', '_', 'QuestionData',
    function($scope, $modal, _ , QuestionData) {
        var question = QuestionData.getQuestion();
        var editFlag = QuestionData.getEditFlag();
        switch(question.type){
            case 'TextQuestion':

                $scope.validators = QuestionData.getTextQuestionValidators();
                break;

            case 'CheckBox':

                if(!editFlag){
                    question.options = [];
                    var optionObj = {};
                    optionObj.translations = {};
                    optionObj._id = 'option_0';
                    question.options[0] = optionObj;
                }
                $scope.validators = QuestionData.getCheckboxValidators();
                break;

            case 'Radio':

                if(!editFlag){
                    question.options = [];
                    var radioObj = {};
                    radioObj.translations = {};
                    radioObj._id = 'option_0';
                    var radioObj2 = {};
                    radioObj2.translations = {};
                    radioObj2._id = 'option_1';
                    question.options[0] = radioObj;
                    question.options[1] = radioObj2;
                }
                $scope.validators = QuestionData.getRadioValidators();
                break;
        };

    }
]);

