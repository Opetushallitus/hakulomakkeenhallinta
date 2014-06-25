'use strick';
angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('checkBox', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'partials/directives/question-check-box.html',
            controller: function($scope){
                /**
                 * lisää valintaruudun kysymykseen
                 * @param question
                 */
                $scope.addCheckbox = function(question){
                    var optionObj = {};
                    var qIndx = question.options.length;
                    optionObj.optionText = {};
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
            }
        }
    });
