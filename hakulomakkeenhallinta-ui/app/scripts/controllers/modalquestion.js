'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('ModalQuestionCtrl', ['$scope', '$rootScope', '$modalInstance', 'Languages', 'question', 'applicationSystem', 'parentElement', '$modal', '_', 'ASForms',
        function($scope, $rootScope, $modalInstance, Languages, question, applicationSystem, parentElement, $modal, _ , ASForms) {
            $rootScope.LOGS('ModalQuestionCtrl '+6);
            $scope.lang = "fi";
            $scope.element = parentElement;
            //TODO: fix this
            $scope.languages = Languages.query();
            $scope.applicationSystem = applicationSystem;
            $scope.question = question;

            $scope.ok = function() {
                ASForms.save( { _id: $scope.applicationSystem._id , _eid: $scope.element._id }, $scope.question).$promise.then(
                    function(data){
                        $scope.question = data;
                        $modalInstance.close({
                            question: $scope.question,
                            parentElement: parentElement
                        });
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
