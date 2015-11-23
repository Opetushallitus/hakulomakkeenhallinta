angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('liitepyyntoCtrl', ['$scope', '$rootScope', 'AlertMsg', '$modal',
        function ($scope, $rootScope, AlertMsg, $modal) {
            /**
             * avaa liitekysmys dialogin kysymykselle
             * @param hakukohde hakukohteen tiedot liitpyynnölle
             * @param option kysymyksen tiedot liitepyynnölle
             */
            $scope.addAppendixRequest = function (hakukohde, option,qt) {

                var attachmentRequest = {
                    header: {
                        translations: {}
                    },
                    description: {
                        translations: {}
                    },
                    deliveryAddress: {},
                    overrideAddress: false
                };
                if (option) {
                    attachmentRequest.attachedToOptionId = option.id;
                }

                $modal.open({
                    templateUrl: 'partials/dialogs/liitepyynto.html',
                    controller: 'AppendixRequestCtrl',
                    scope: $scope,
                    resolve: {
                        attachmentRequest: function () {
                            return attachmentRequest;
                        },
                        question: function () {
                            return qt;
                        }
                    }
                }).result.then(function (data) {
                        if ($scope.question.attachmentRequests === undefined) {
                            $scope.question.attachmentRequests = [];
                        }
                        $scope.question.attachmentRequests[$scope.question.attachmentRequests.length] = data;
                    });
            };
            /**
             * liitepyynnön poisto kysymyksestä
             * @param index kysymyksen indx, joka on liitetty liitepyyntöön
             */
            $scope.removeAppendixRequest = function (option) {
                if (option) {
                    $scope.question.attachmentRequests = _.reject($scope.question.attachmentRequests, function (attachment) {
                        return attachment.attachedToOptionId === option.id;
                    });
                } else {
                    $scope.question.attachmentRequests = [];
                }
            };
            /**
             * avaa liitepyynnön muokkaus dialogin kysymyksen liitepynnölle
             * @param hakukohde hakukohteen tiedot liitepyynnölle
             * @param option kysymyksen tiedot liitepyynnölle
             */
            $scope.modifyAppendixRequest = function (option,qt) {
                var attachmentRequest;
                if (option) {
                    attachmentRequest = _.find($scope.question.attachmentRequests, function (attachment) {
                        return attachment.attachedToOptionId === option.id;
                    });
                } else {
                    attachmentRequest = $scope.question.attachmentRequests[0];
                }
                $modal.open({
                    templateUrl: 'partials/dialogs/liitepyynto.html',
                    controller: 'AppendixRequestCtrl',
                    scope: $scope,
                    resolve: {
                        attachmentRequest: function () {
                            return angular.copy(attachmentRequest);
                        },
                        question: function () {
                            return qt;
                        }
                    }
                }).result.then(function (data) {
                        for (var atcrq in $scope.question.attachmentRequests) {
                            if ($scope.question.attachmentRequests[atcrq].attachedToOptionId === data.attachedToOptionId) {
                                $scope.question.attachmentRequests[atcrq] = data;
                                return;
                            }
                        }
                    });
            };
            /**
             * tarkistaa ui:ssa onko kysymykseen liitetty liitepyyntö
             * @param index kysymyksen index, joka on liitetty liitepyyntöön
             * @returns {boolean}
             */
            $scope.hasLiitepyynto = function (element) {
                if (element) {
                    return _.some($scope.question.attachmentRequests, function (attachmentRequest) {
                        return attachmentRequest.attachedToOptionId === element.id;
                    });
                } else {
                    return $scope.question.attachmentRequests && $scope.question.attachmentRequests.length > 0;

                }

            };
        }
    ]);
