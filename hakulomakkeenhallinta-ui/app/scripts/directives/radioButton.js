'use strick';
angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('radioButton', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'partials/directives/question-radio-button.html',
            controller: function($scope){
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
            }
        }
    });
