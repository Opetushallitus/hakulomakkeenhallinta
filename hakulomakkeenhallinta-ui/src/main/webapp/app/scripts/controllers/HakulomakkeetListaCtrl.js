'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('HakulomakkeetListaCtrl',
    function ($scope, $rootScope, $modal, $log, $location, FormEditor, _, $filter, Koodisto, Organisaatio, $cookies) {
        $rootScope.LOGS('HakulomakkeetListaCtrl');

        $scope.applicationForms = [];
        $scope.statukset = [];
        $scope.vuodet = [];
        $scope.kaudet = [];
        $scope.hakutyypit = [];
        $scope.search = $cookies.formListSearch;

        $scope.setSearchToCookie = function () {
            $cookies.formListSearch = $scope.search;
        };
        $scope.$emit('LOADPAGE');
        /**
         * haetaan hakulomakkeet lista
         */
        FormEditor.getApplicationSystemForms().then(
            function (data) {
                $scope.statukset = _.uniq(_.map(data, function (status) { return status.status; }));
                $scope.statukset.push('');
                $scope.statukset =  $filter('orderBy')($scope.statukset, 'toString()');

                $scope.vuodet = _.uniq(_.map(data, function (vuosi) { return vuosi.year; }));
                $scope.vuodet.push('');
                $scope.vuodet =  $filter('orderBy')($scope.vuodet, 'toString()');

                Koodisto.getKausiKoodit().then(
                    function (kausiKoodit) {
                        kausiKoodit.push({period: ''});
                        $scope.kaudet =  $filter('orderBy')(kausiKoodit, 'period');
                    }
                );
                Koodisto.getHakutyyppiKoodit().then(
                    function (hakutyyppiKoodit) {
                        hakutyyppiKoodit.push(
                            {
                                translations: {
                                    fi: '',
                                    sv: '',
                                    en: ''
                                }
                            }
                        );
                        $scope.hakutyypit = $filter('orderBy')(hakutyyppiKoodit, 'translations.' + $scope.userLang);
                    }
                );
                $scope.$emit('LOADPAGEREADY');
                $scope.applicationForms = data;

            }
        );
        /**
         * Avataan näkymä hakulomakkeen lisäkysymyksiin
         * @param applicationSystemForm haun ID
         */
        $scope.hakukohdeKohtaisetLisakysymykset = function (applicationSystemForm) {
            $location.path("/themeQuestionsByOrganisation/" + applicationSystemForm._id + '/' + Organisaatio.getUserSelectedOrganisation().oid);
        };
        /**
         * Avataan näkymä hakulomakkeen asetuksuun
         * @param applicationForm haun ID
         */
        $scope.lomakepohjanAsetukset = function (applicationForm) {
            $location.path("/applicationSystemFormConfigurations/" + applicationForm._id + '/' + Organisaatio.getUserSelectedOrganisation().oid);
        };
    }
);
