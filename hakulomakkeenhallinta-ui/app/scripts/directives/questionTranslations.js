'use strick';
angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('questionTranslations', function () {
        return{
            restrict: 'E',
                replace: true,
                template: '<span>{{tlLanguages}}</span>',
                link: function(scope, elem, attrs){
                    var lngs= '';
                    for(var lang in scope.question.messageText.translations){
                        if(scope.question.messageText.translations['fi']){
                            lngs +='fi ';
                        }
                        if(scope.question.messageText.translations['sv']){
                            lngs +='sv ';
                        }
                        if(scope.question.messageText.translations['en']){
                            lngs +='en ';
                        }
                    }
                    scope.tlLanguages = lngs;
            }
        }
    });
