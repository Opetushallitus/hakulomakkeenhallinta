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
                    $scope.validateSelectionsToCheckboxAmount();
                };
                /**
                 * poistaa valintaruudun kysymyksestä
                 * sekä siihen mahdollisesti liitety liitepyynnön
                 * @param indx
                 * @param question
                 */
                $scope.removeCheckbox = function(indx, question){
                    if(question.options.length >1 ){
                        question.options.splice(indx ,1);
                        $scope.removeAppendixRequest(indx);
                    }
                    for(var optionIndx in question.options){
                        if(question.liitepyynnot !== undefined){
                            for(var li in question.liitepyynnot){
                                if(question.options[optionIndx].id === question.liitepyynnot[li].id){
                                    question.liitepyynnot[li].id = 'option_'+optionIndx;
                                }
                            }
                        }
                        question.options[optionIndx].id = 'option_'+optionIndx;
                    }
                    $scope.validateSelectionsToCheckboxAmount();
                };


            },
            link: function($scope, elem, attrs){
                /**
                 * tarkistetaan valittavien valintaruutujen asetettujen arvojen
                 * vastaamaan valintaruujen määrää lisättäessä ja poistettaessa
                 * valintaruutuja
                 */
                $scope.validateSelectionsToCheckboxAmount = function(){
                    var minSelection = $scope.question.validators.min,
                        maxSelection = $scope.question.validators.max,
                        nroCheckBox = $scope.question.options.length;

                    if(minSelection !== undefined){
                        if(nroCheckBox < minSelection){
                            $scope.kysymys.minvalintaruutuja.$setValidity('checkboxminvalue', false);
                        }else{
                            $scope.kysymys.minvalintaruutuja.$setValidity('checkboxminvalue', true);
                        }
                    }

                    if(maxSelection !== undefined){
                        if(nroCheckBox < maxSelection){
                            $scope.kysymys.maxvalintaruutuja.$setValidity('checkboxmaxvalue', false);
                        }else{
                            $scope.kysymys.maxvalintaruutuja.$setValidity('checkboxmaxvalue', true);
                        }
                    }

                };
            }
        }
    });
