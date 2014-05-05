'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('ModalQuestionCtrl', ['$scope', '$modalInstance', 'Resources', 'question', 'applicationSystem', 'parentElement',
        function($scope, $modalInstance, Resources, question, applicationSystem, parentElement) {
            $scope.lang = "fi";
            $scope.element = parentElement;
            $scope.languages = Resources.languages.query($scope.queryParameters);
            $scope.applicationSystem = applicationSystem;
            $scope.question = question;

            $scope.ok = function() {
                $modalInstance.close({
                    question: this.question,
                    parentElement: parentElement
                });
            };

            $scope.back = function() {
                $modalInstance.dismiss('cancel');
            };
            $scope.addNewTranslation = function() {
                alert('Not implemented!' + $scope.languages.length);
            };
        }
    ]);
