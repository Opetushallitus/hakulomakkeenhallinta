'use strick';
/**
 * Custom lomakkeen syötekentän validaattori
 * tarkistetaan valittavien valintaruutujen maksi määrä
 * vastaamaan valintaruujen määrää
 * asettaa lomakkeen $valid arvon true/false
 */
angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('checkboxmaxvalue', function(){
        return{
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl){
                ctrl.$parsers.unshift(function(viewValue){
                    var nroCheckBox = scope.question.options.length;
                    if(nroCheckBox < viewValue){
                        ctrl.$setValidity('checkboxmaxvalue', false);
                        return viewValue;
                    } else {
                        ctrl.$setValidity('checkboxmaxvalue', true);
                        return viewValue;
                    }
                });
            }
        }
    });

