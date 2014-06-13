/**
 * UI-directive käännösten käyttämiseen
 */
angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('tl', ['LocalisationService', function(LocalisationService) {

    return {
        restrict: 'A',
        replace: true,
        scope: false,
        compile: function(element, attrs) {
            var key = attrs["tl"];
            LocalisationService.getTranslation(key).then(function(data){
                element.html(data);
            });

        }

    };
}]);
