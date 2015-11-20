angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('RichTextCtrl', ['$scope', '$rootScope', 'AlertMsg', '$modal',
        function($scope, $rootScope, AlertMsg, $modal) {

            $scope.kysymys.validationFn = function() {
                return _.some($scope.question.messageText.translations, function(text) {
                    return angular.element(text).text().trim() !== '';
                });
            };

        }
    ]);
