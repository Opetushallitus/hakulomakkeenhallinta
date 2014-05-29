'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('ModalQuestionCtrl', ['$scope', '$modalInstance', 'Languages', 'question', 'applicationSystem', 'parentElement', '$modal', '_', 'ASForms',
        function($scope, $modalInstance, Languages, question, applicationSystem, parentElement, $modal, _ , ASForms) {
            console.log('***** ModalQuestionCtrl ****');
            $scope.lang = "fi";
            $scope.element = parentElement;
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
