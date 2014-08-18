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
                 * sekä siihen mahdollisesti liitetyn liitepyynnön
                 * @param indx
                 * @param question
                 */
                $scope.removeRadio = function(indx, question){
                    if(question.options.length >2 ){
                        question.options.splice(indx ,1);
                        $scope.removeAppendixRequest(indx);
                    }
                    for(var optionIndx in question.options){
                        if(question.attachmentRequests !== undefined){
                            for(var li in question.liitepyynnot){
                                if(question.options[optionIndx].id === question.attachmentRequests[li].attachedToOptionId){
                                    question.attachmentRequests[li].attachedToOptionId = 'option_'+optionIndx;
                                }
                            }
                        }
                        question.options[optionIndx].id = 'option_'+optionIndx;
                    }
                };
            }
        }
    });
