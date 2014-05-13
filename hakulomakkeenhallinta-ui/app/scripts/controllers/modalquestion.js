'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('ModalQuestionCtrl', ['$scope', '$modalInstance', 'Resources', 'question', 'applicationSystem', 'parentElement', '$modal', '_', 'ASForms',
        function($scope, $modalInstance, Resources, question, applicationSystem, parentElement, $modal, _ , ASForms) {
            $scope.lang = "fi";
            $scope.element = parentElement;
            $scope.languages = Resources.languages.query($scope.queryParameters);
            $scope.applicationSystem = applicationSystem;
            $scope.question = question;
            $scope.ok = function() {

                console.log('lisäkysmys: ', $scope.question);
                console.log('hakemus: ', $scope.element._id);


                ASForms.save( { _id: $scope.applicationSystem._id , _eid: $scope.element._id }, $scope.question).$promise.then(
                    function(data){
                            console.log(data);
                            $scope.question = data;
                    });
                /*$modalInstance.close({
                    question: this.question,
                    parentElement: parentElement
                });*/
            };

            $scope.back = function() {
//                $modalInstance.dismiss('cancel');
                $modalInstance.close({
                    parentElement: parentElement,
                    applicationSystem: applicationSystem
                });
/*                $modal.open({
                    templateUrl: 'partials/lisakysymykset/kysymystyypin-valinta.html',
                    controller: 'SelectThemeAndQuestionTypeCtrl',
                    resolve: {
                        applicationSystem: function() {
                            return $scope.applicationSystem;
                        }
                    }
                }).result.then(function(data) {
                        $modal.open({
                            templateUrl: 'partials/lisakysymykset/kysymystekstit.html',
                            controller: 'ModalQuestionCtrl',
                            resolve: {
                                question: function() {
                                    return _.defaults({}, {
                                        _id: '',
                                        i18nText: {
                                            translations: {}
                                        },
                                        validators: [
                                            {},
                                            {}
                                        ],
                                        children: [],
                                        additionalHelp: {
                                            translations: {}
                                        },
                                        verboseHelp: {
                                            translations: {}
                                        },

                                        attributes:{
                                            id: '',
                                            name: '',
                                            required: '',
                                            type:'',
                                            size:''
                                        },
                                        link: {},
                                        options: {},
                                        _class: elemTypePrefix + data.type.id
                                    });
                                },
                                parentElement: function() {
                                    return data.theme;
                                },
                                applicationSystem: function() {
                                    return $scope.applicationSystem;
                                }
                            }
                        }).result.then(function(data) {
                                if (!data.parentElement.additionalQuestions) {
                                    data.parentElement.additionalQuestions = [];
                                }
                                data.parentElement.additionalQuestions.push(data.question);
                            });
                    }); */
            };
            $scope.addNewTranslation = function() {
                alert('Not implemented!' + $scope.languages.length);
            };
        }
    ]);
