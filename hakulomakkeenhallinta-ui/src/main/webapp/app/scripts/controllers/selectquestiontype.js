'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('SelectQuestionTypeCtrl',
    function($scope, $rootScope, $modalInstance, FormEditor, applicationSystem, theme, hakukohde, $filter, JatkokysymysService, TarjontaAPI, _, Organisaatio, QuestionData) {

        $rootScope.LOGS('SelectQuestionTypeCtrl');
        $scope.applicationSystem =  applicationSystem;
        $scope.theme = theme;
        $scope.hakukohde = hakukohde;
        $scope.haunNimi = $filter('i18n')(applicationSystem, 'name', $scope.userLang);
        $scope.teema = $filter('i18n')(theme, 'name', $scope.userLang);
        $scope.hakukohdeNimi = $filter('hakukohdeNimi')(hakukohde, $scope.userLang);

        if ($scope.hakukohdeNimi === undefined &&
            (hakukohde.hakukohteenNimet === undefined || hakukohde.hakukohteenNimi === undefined
            || hakukohde.nimi === undefined)) {
            if (hakukohde.additionalQuestions && hakukohde.additionalQuestions[0].targetIsGroup) {
                Organisaatio.getOrganisationData(hakukohde.aoid).then(
                    function (hkData) {
                        QuestionData.setIsGroup(true);
                        $scope.hakukohdeNimi = $filter('hakukohdeNimi')(hkData, $scope.userLang);
                    }
                );
            } else {
                TarjontaAPI.fetchHakukohdeInfo(hakukohde.aoid).then(
                    function (hkData) {
                        $scope.hakukohdeNimi = $filter('hakukohdeNimi')(hkData, $scope.userLang);
                    }
                );
            }

        }

        $scope.types;
        var jatkokysymysObj = JatkokysymysService.getJatkokysymysObj();
        /**
         * haetaan kysymys tyypit HH:n taustajärjestelmästä
         */
        FormEditor.getQuestionTypes().then( function (data) {
                $scope.types = data;
            }
        );

        $scope.ok = function () {
            $modalInstance.close({
                    type: this.type
                }
            );
        };

        $scope.cancel = function () {
            if (jatkokysymysObj !== undefined && jatkokysymysObj.kysymykset !== undefined) {
                $modalInstance.dismiss(
                    {
                        msg: 'jatkokysymys',
                        data: jatkokysymysObj
                    }
                );
            } else {
                $modalInstance.dismiss('cancel');
            }


        };

    });
