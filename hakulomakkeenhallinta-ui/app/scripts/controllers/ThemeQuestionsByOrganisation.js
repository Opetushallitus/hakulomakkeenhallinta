'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('ThemeQuestionsByOrganisationCtrl', ['$rootScope','$scope', '$modal', '$location', '_', '$routeParams', 'FormEditor', 'FormWalker', 'QuestionData', 'ThemeQuestions', 'Organisaatio', '$filter', 'TarjontaAPI', '$q', 'AlertMsg',
        function($rootScope, $scope, $modal, $location, _, $routeParams, FormEditor, FormWalker, QuestionData, ThemeQuestions, Organisaatio, $filter, TarjontaAPI, $q, AlertMsg ) {
            $rootScope.LOGS('ThemeQuestionByOrganisationCtrl');

            $scope.haunNimi = '';
            $scope.organisationNimi = '';
            /**
             * haetaan valitun organisaation tiedot organisaatio palvelusta
             * valitun organisaation id:llä
             */
            Organisaatio.fetchOrganisation($routeParams.oid).then(
                function (data) {
                    $scope.organisationNimi = $filter('organisaatioNimi')(data, $scope.userLang);
                }
            );

            $scope.applicationSystem = {};
            /**
             * haetaan valitun hakulomakkeen tiedot hakulomakkeen Id:llä
             */
            FormEditor.fetchApplicationSystemForm($routeParams.id).then(
                function (data) {
                    $scope.applicationSystem = data;
                    $scope.haunNimi = $filter('i18n')(data, 'name', $scope.userLang);
                }
            );

            $scope.themes = [];
            /**
             * heataan hakulomakkeen teemat halomamekkeen id:llä ja siihen liityvä lisäkysymykset
             * ja asetetaan ne käyttöliittymään oikean teeman ja hakukohteen alle
             */
            function hakukohdeKohtaisetKysymykset() {
                var deferred = $q.defer();
                FormEditor.getApplicationSystemFormThemes($routeParams.id).then(
                    function (themes) {
                        ThemeQuestions.getThemeQuestionListByOrgId($routeParams.id, $routeParams.oid).then(
                            function (themeQues) {
                                var hakukohdeIds = [];
                                //parsitaan lisäkysymyksistä hakukohde id:t taulukkoon
                                hakukohdeIds = _.uniq( _.map(themeQues, function (lopIds) { return lopIds.learningOpportunityId; }));
                                //parsitaan lisäkysmys oikean teeman ja hakukohteen alle
                                for (var themeIndx = 0, themesLength = themes.length; themeIndx < themesLength; themeIndx += 1){
                                    themes[themeIndx].hkkohde = [];
                                    for (var hkIndx = 0, hakukohdeIdsLength = hakukohdeIds.length; hkIndx < hakukohdeIdsLength; hkIndx += 1){
                                        themes[themeIndx].hkkohde[hkIndx] = {};
                                        themes[themeIndx].hkkohde[hkIndx].aoid = hakukohdeIds[hkIndx];
                                        themes[themeIndx].hkkohde[hkIndx].additionalQuestions = [];
                                        for (var queIndx = 0, themeQsLength = themeQues.length; queIndx < themeQsLength; queIndx += 1){
                                            if (themeQues[queIndx].theme !== undefined ){
                                                if (themes[themeIndx].id === themeQues[queIndx].theme && hakukohdeIds[hkIndx] === themeQues[queIndx].learningOpportunityId){
                                                    themes[themeIndx].hkkohde[hkIndx].additionalQuestions.push(themeQues[queIndx]);
                                                }
                                            }
                                        }
                                    }
                                }
                                deferred.resolve(themes);
                            }
                        );
                    }
                );
                return deferred.promise;
            };
            /**
             * päivitetään asynkroninen teema data $scopeen kun se on käsitelty
             * yllä olevassa funtiossa
             */
            hakukohdeKohtaisetKysymykset().then(function(data){
                $scope.themes = data;
            });
            /**
             * avataan dialogit uuden kysymyksen hakukohteen ja tyypin alustamiseksi
             * @param theme
             */
            $scope.addQuestion = function(theme) {
                $modal.open({
                    templateUrl: 'partials/dialogs/hakukohteen-valinta.html',
                    controller: 'SelectHakukohdeCtrl',
                    scope: $scope,
                    resolve: {
                        applicationSystem: function(){
                            return $scope.applicationSystem;
                        },
                        theme: function(){
                            return theme;
                        }
                    }
                }).result.then(function(data){
                        $modal.open({
                            templateUrl: 'partials/dialogs/kysymystyypin-valinta.html',
                            controller: 'SelectQuestionTypeCtrl',
                            scope: $scope,
                            resolve: {
                                applicationSystem: function () {
                                    return data.applicationSystem;
                                },
                                theme: function () {
                                    return data.theme;
                                },
                                hakukohde: function () {
                                    return data.hakukohde;
                                }
                            }
                        }).result.then(function (data) {
                                $rootScope.LOGS('ThemeQuestionByOrganisationCtrl','addQuestion()', data);
                                QuestionData.newAdditionalQuestion();
                                QuestionData.setQuestionType(data.type);
                                QuestionData.setTheme(theme);
                                QuestionData.setApplicatioSystemId($routeParams.id);
                                QuestionData.setEditFlag(false);
                                QuestionData.setLearningOpportunityId(QuestionData.getApplicationOption().oid);
                                $rootScope.LOGS('ThemeQuestionByOrganisationCtrl', QuestionData.getQuestion() );
                                $location.path('/themeQuestionsByOrganisation/' + $routeParams.id + '/' + $routeParams.oid + '/' + QuestionData.getApplicationOption().oid + '/' + theme.id + '/' + data.type.id);
                            }
                        );
                    }
                );
            };
            /**
             * takaisin edelliselle sivulle
             */
            $scope.back = function () {
                $location.path('/');
            };

            $scope.accordianState = function(theme){
                for (var hkIndx = 0, hkkohdeLength = theme.hkkohde.length; hkIndx < hkkohdeLength; hkIndx+=1){
                    if (theme.hkkohde[hkIndx].additionalQuestions !== undefined && theme.hkkohde[hkIndx].additionalQuestions.length > 0){
                        return true;
                    }
                }
                return false;
            };
        }]);