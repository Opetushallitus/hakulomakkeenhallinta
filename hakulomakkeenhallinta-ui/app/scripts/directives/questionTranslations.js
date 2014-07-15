'use strick';
angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('questionTranslations', function () {
        return{
            restrict: 'E',
            replace: true,
            template: '<span>{{tlLanguages}}</span>',
            link: function(scope, elem, attrs){
                var lngs= '';
                if(scope.question.messageText.translations['fi'] && lngs.indexOf('fi') === -1){
                    lngs +='fi ';
                }
                if(scope.question.messageText.translations['sv'] && lngs.indexOf('sv') === -1){
                    lngs +='sv ';
                }
                if(scope.question.messageText.translations['en'] && lngs.indexOf('en') === -1){
                    lngs +='en ';
                }
                scope.tlLanguages = lngs;
            }
        }
    });
