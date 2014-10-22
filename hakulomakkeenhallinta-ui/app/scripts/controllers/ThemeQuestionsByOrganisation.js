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
                                _.each(themes, function (teema, indx) {
                                        console.log('#1 ',teema.id, indx, teema);
                                        themes[indx].hkkohde = [];
                                        var teemanKysymykset = _.where(themeQues, {theme: teema.id}),
                                            teemanHakukohteet = _.uniq( _.map(teemanKysymykset, function (lopIds) { return lopIds.learningOpportunityId; }));

                                        _.each(teemanHakukohteet, function(lopId, indx2) {
                                                themes[indx].hkkohde[indx2] = {};
                                                themes[indx].hkkohde[indx2].aoid = lopId;
                                                themes[indx].hkkohde[indx2].additionalQuestions = _.where(themeQues, {theme: teema.id, learningOpportunityId: lopId});
                                                console.log('#2.1 ', _.where(themeQues, {theme: teema.id, learningOpportunityId: lopId}));
                                            }
                                        );
                                        console.log('#2 ',themes[indx].hkkohde);
                                    }
                                );
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

            $scope.lisaaSaanto = function (hkKysymysLista) {
                console.log('Tähän avataan dialogi säännöille ');
                console.log(hkKysymysLista);
                $modal.open({
                    templateUrl: 'partials/dialogs/lisaa-saanto.html',
                    controller: 'addRuleCtrl',
                    resolve:{
                        hkKysymysLista: function () {
                            return hkKysymysLista;
                        }
                    }
                }).result.then(function (data) {
                        console.log('##', data);
                        hkKysymysLista = data;
                    });

            }
        }]);