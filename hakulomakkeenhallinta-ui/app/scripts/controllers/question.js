'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
.controller('QuestionCtrl', ['$scope', '$modal', '_', 'QuestionData',
    function($scope, $modal, _ , QuestionData) {
        console.log('QuestionCtrl');
        var validatortypePrefix = "fi.vm.sade.haku.oppija.lomake.validation.validators.RequiredFieldValidator";

        $scope.validators = QuestionData.getTextQuestionValidators();

        $scope.addValidator = function(question) {
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

