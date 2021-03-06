'use strick';

/**
 * Custom lomakkeen syötekentän validaattori
 * tarkistetaan valittavien valintaruutujen minimi määrä
 * vastaamaan valintaruujen määrää
 * asettaa lomakkeen $valid arvon true/false
 */
angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('checkboxminvalue', function () {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$parsers.unshift(function (viewValue) {
                    if (viewValue > 0) {
                        scope.question.requiredFieldValidator = true;
                    } else {
                        delete scope.question.requiredFieldValidator;
                    }

                    var nroCheckBox = scope.question.options.length;
                    if (nroCheckBox < viewValue) {
                        ctrl.$setValidity('checkboxminvalue', false);
                        return viewValue;
                    } else {
                        ctrl.$setValidity('checkboxminvalue', true);
                        return viewValue;
                    }

                });
            }
        };
    });
