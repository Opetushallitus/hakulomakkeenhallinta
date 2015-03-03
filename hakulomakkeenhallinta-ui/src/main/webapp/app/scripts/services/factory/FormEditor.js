'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.factory')
    .factory('FormEditor', ['$rootScope', '$q', '$resource', 'Props', '$timeout',
        function ($rootScope, $q, $resource, Props, $timeout) {
        var formEditor = {},
            _applicationsSystemForms = [];

        var FormEditor = $resource(Props.formEditorUri + '/:_path/:_id/:_oper',
            {_path: '@_path', _id: '@_id', _oper:'@_oper'}, {}
        );

        $rootScope.LOGS('FormEditor');
        var _applicationsSystemForm;
        /**
         * asettaa hakemuksen Json objectin muuttujaan
         * @param applicationSystemForm
         */
        formEditor.setApplicationSystemForm = function (applicationSystemForm) {
            _applicationsSystemForm = applicationSystemForm;
        };
        /**
         * Palauttaa hakemus Json Objection muuttujasta
         * @returns {*}
         */
        formEditor.getApplicationSystemForm = function () {
            return _applicationsSystemForm;
        };
        /**
         * hakee hakulomakkeen id:llä
         * @param id: hakulomakkeen id
         * @returns {promise}
         */
        formEditor.fetchApplicationSystemForm = function (id) {
            var deferred = $q.defer();
            $rootScope.LOGS('FormEditor', 'fetchApplicationSystemForm() haku oid: ', id);
            $rootScope.LOGS('FormEditor', 'fetchApplicationSystemForm()', '_applicationsSystemForm: ', _applicationsSystemForm);
            if (_applicationsSystemForm !== undefined &&_applicationsSystemForm._id !== undefined) {
                if (_applicationsSystemForm._id === id) {
                    deferred.resolve(_applicationsSystemForm);
                }
            } else {
                $rootScope.LOGS('FormEditor', 'fetchApplicationSystemForm()', 'else');
                FormEditor.get({'_path': 'application-system-form', '_id': id, '_oper': 'name'}).$promise.then(
                    function (data) {
                        $rootScope.LOGS('FormEditor', data);
                        deferred.resolve(data);

                    }
                );
            }
            return deferred.promise;
        };
        /**
         * Palauttaa kaikki hakulomakkeet tiedot listan
         * @returns {*}
         */
        formEditor.getApplicationSystemForms = function () {
            $rootScope.LOGS('FormEditor', 'getApplicationSystemForms()');
            var deferred = $q.defer();
            if (_applicationsSystemForms.length > 0){
                deferred.resolve(_applicationsSystemForms);
            } else {
                FormEditor.query({'_path': 'application-system-form'}).$promise.then(
                    function (data) {
                        _applicationsSystemForms = data;
                        deferred.resolve(data);
                    }
                );
            }

            return deferred.promise;
        };
        /**
         * Palauttaa hakulomakkeen teemat lisäkysmyksiä varten hakulomakkeen id:llä
         * @param applicationSystemId: hakulomakkeen id
         * @returns {promise}: hakulomakkeen teemat
         */
        formEditor.getApplicationSystemFormThemes = function (applicationSystemId) {
            $rootScope.LOGS('FormEditor', 'getApplicationSystemFormThemes()');
            var deferred = $q.defer();
            FormEditor.query({'_path': 'application-system-form', '_id': applicationSystemId , '_oper': 'additional-question-themes'}).$promise.then(
                function (data) {
                    deferred.resolve(data);
                }
            );
            return deferred.promise;
        };
        /**
         * Haetaan tuetut kielet hakulomakkeenhallinnan taustajärjestelmästä
         * @returns {promise}
         */
        formEditor.getLanguages = function () {
            var deferred = $q.defer();
            FormEditor.query({'_path':'languages'}).$promise.then(
                function(data){
                    deferred.resolve(data);
                }
            );
            return deferred.promise;
        };
        /**
         * Palauttaa hakulomakkeenhallinnan taustajärjestelmästä
         * listan kysymys tyyppeistä
         * @returns {promise}
         */
        formEditor.getQuestionTypes = function () {
            var deferred = $q.defer();
            FormEditor.query({'_path':'types'}).$promise.then(
                function (data) {
                    deferred.resolve(data);
                }
            );
            return deferred.promise;
        };
        /**
         * Palauttaa hakulomakkeenhallinan taustajärjestelmästä
         * kysymyksen sen tyypillä
         * @param type kysymyksen tyyppi
         * @returns {promise}
         */
        formEditor.getQuestionType = function (type) {
            var deferred = $q.defer();
            FormEditor.query({'_path':'types', '_id':type}).$promise.then(
                function (data) {
                    deferred.resolve(data);
                }
            );
            return deferred.promise;
        };
        /**
         * Palauttaa hakulomakkeeseen liittyvät organisaatiot
         * @param applicationSystemId hakulomakkeen id
         * @returns {promise}
         */
        formEditor.getApplicationSystemFormOrgnisations = function (applicationSystemId) {
            $rootScope.LOGS('FormEditor','getApplicationSystemFormOrgnisations()', applicationSystemId);
            var deferred = $q.defer();
            FormEditor.query({'_path':'application-system-form','_id': applicationSystemId, '_oper':'represented-organizations'}).$promise.then(
                function success (data) {
                    deferred.resolve(data);
                },
                function error(err) {
                    deferred.reject(err);
                }
            );
            return deferred.promise;
        };
        /**
         * Paulauttaa teeman tiedot sen id:llä
         * @param applicationSystemId hakulomakkeen id
         * @param themeId teeman id
         * @returns {promise} teeman tiedot
         */
        formEditor.getThemeByThemeId = function (applicationSystemId, themeId) {
            $rootScope.LOGS('FormEditor', 'getThemeByThemeId()', applicationSystemId, themeId);
            var deferred = $q.defer();
            this.getApplicationSystemFormThemes(applicationSystemId).then(
                function (data) {
                    for (var theme in data) {
                        if (data[theme].id === themeId) {
                            deferred.resolve( data[theme]);
                        }
                    }
                }
            );
            return deferred.promise;
        }

        return formEditor;
    }]);

