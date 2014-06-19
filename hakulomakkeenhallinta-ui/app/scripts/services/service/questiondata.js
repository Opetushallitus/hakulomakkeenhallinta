'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.service')
    .service('QuestionData', [ 'FormEditor','$rootScope', 'ThemeQuestions', '$q',
        function (FormEditor, $rootScope, ThemeQuestions, $q ) {
            //kysymys olio
            var _question = {};
            //hakukohteen id
            var _applicationSystemId;
            //kysymyksen teema objekti
            var _theme ={};
            //kysymyksen tyyppi
            var _questionType;
            //kysymys taulukko
            var _additionalQuestions = [];
            //kysymyksen muokkaus lippu
            var _editFlag = false;
            //hakukohde muuttuja objekti
            var _applicationOption = null;
            /**
             * tallennetaan hakukohde objectin muuttujaan
             * @param applicationOption
             */
            this.setApplicationOption = function(applicationOption){
                _applicationOption = applicationOption;
            };
            /**
             * Palautaa hakukohde muuttuja objectin
             * @returns {*}
             */
            this.getApplicationOption = function(){
                return _applicationOption;
            };
            /**
             * Palauttaa avoin tekstikenttä validaattorit
             * @returns {string[]}
             */
            this.getTextQuestionValidators = function(){
                return ['requiredFieldValidator', 'sizeFieldValidator' /*,'RegexFieldValidator'*/];
            };
            /**
             * palauttaa valintaruudun validaattorit
             * @returns {string[]}
             */
            this.getCheckboxValidators = function(){
                return ['requiredFieldValidator', 'minValueValidator','maxValueValidator'];
            };
            /**
             * palauttaa valintanapin validaattorit
             * @returns {Array}
             */
            this.getRadioValidators = function(){
                return [];
            };
            /**
             * palauttaa kysymyksen muokkaus lipun arvon
             * @returns {boolean} true/false
             */
            this.getEditFlag = function(){
                return _editFlag;
            };
            /**
             * asettaa kysymyksen muokkaus lipun arvon
             * oletuksena arvon on false
             * @param flag true/false
             */
            this.setEditFlag = function(flag){
                _editFlag = flag;
            };
            /**
             * Palauttaa lisäkysymys taulukon
             * @returns {Array}
             */
            this.getAdditionalQuestions = function(){
                return _additionalQuestions;
            };
            /**
             * Lisää lisäkysmyksen taulukkoon
             * @param question
             */
            function setAdditionalQuestions(question){
                _additionalQuestions.push(question);
            };
            /**
             * Luo alustuksen uudelle kysmykselle
             */
            this.newAdditionalQuestion = function(){
                _question = {};
                _question.theme = "";
                _question._id = "";
                _question.messageText = {};
                _question.messageText.translations = {};
                _question.helpText ={};
                _question.helpText.translations ={};
                _question.verboseHelpText = {};
                _question.verboseHelpText.translations ={};
                _question.type= "";
                _question.applicationSystemId= "";
                _question.learningOpportunityId = "";
                _questionType = '';
                _applicationSystemId;
            };
            /**
             * Tallentaa kysymyksen muuttujaan ja lisää sen
             * lisäkysymys taulukkoon
             * @param question kysymys data
             */
            this.setQuestion = function(question){
                _question = question;
                if(!_editFlag){
                    setAdditionalQuestions(question);
                }
            };
            /**
             * Tyhjentää lisäkysymys taulukon tyhjäksi taulukoksi
             */
            this.clearAdditonalQuestions = function(){
                _additionalQuestions = [];
            };
            /**
             *Palauttaa kysymys muuttuja objektin
             * @returns {{}} kysymys data objekti
             */
            this.getQuestion = function () {
                return _question;
            };
            /**
             * Asettaa hakulomake id:n kysymykseen ja muuttujaan
             * @param applicationSystemId hakulomakkeen id
             */
            this.setApplicatioSystemId = function(applicationSystemId){
                _applicationSystemId = applicationSystemId;
                _question.applicationSystemId = applicationSystemId;
            };
            /**
             * palauttaa hakulomakkeen id:n muuttujasta
             * @returns {*} hakulomakkeen id
             */
            this.getApplicationSystemId = function(){
                return _applicationSystemId;
            };
            /**
             * Asettaa kysymykseen hakukohteen id:n
             * @param hakuOid hakukohteen id
             */
            this.setLearningOpportunityId = function(hakuOid){
                _question.learningOpportunityId = hakuOid;
            };
            /**
             * palauttaa kysymyksen asettetun hakukohde id:n
             * @returns {string} hakukohde id
             */
            this.getLerningOpportunityId = function(){
                return _question.learningOpportunityId;
            };
            /**
             * asetetaan teema id lisäkysymykseen
             * @param themeId
             */
            this.setThemeId = function(themeId){
                $rootScope.LOGS('QuestionData ','setTheme()', themeId);
                _question.theme = themeId;

            };
            /**
             * palauttaa lisäkysymyksen teeman id:n
             * @returns {string}
             */
            this.getThemeId = function(){
                return _question.theme;
            };
            /**
             * asetttaa kysymyksen teeman muuttujaan
             * @param theme teema objekti
             */
            this.setTheme = function(theme){
                this.setThemeId(theme.id);
                _theme = theme;
            };
            /**
             * Palautta teema objetin muutujasta
             * tai HH:n taustajärjestelmästä
             * @returns {promise} teema objekti
             */
            this.getTheme = function(){
                $rootScope.LOGS('QuestionData ','getTheme()', _theme);
                var deferred = $q.defer();
                if( _theme.id === undefined){
                    FormEditor.getThemeByThemeId(this.getApplicationSystemId(), this.getThemeId()).then(
                        function(data){
                            deferred.resolve(data);
                        });
                }else{

                    deferred.resolve(_theme);
                }
                return deferred.promise;
            };
            /**
             * asetataan kysymyksen tyyppi lisäkysymys objektiin
             * @param type kysymyksen tyyppi
             */
            this.setType = function(type){
                _question.type = type;
            };
            /**
             * Palauttaa kysymyksen tyyppin HH:n taustajärjestelmästä
             * @param type kysymyksen tyyppi
             * @returns {promise}
             */
            this.getType = function(type){
                $rootScope.LOGS('QuestionData ', 'getType()', type);
                var deffered = $q.defer();
                FormEditor.getQuestionType(type).then(
                    function(data){
                        $rootScope.LOGS('QuestionData ','getType()', data);
                        deffered.resolve(data);
                    });
                return deffered.promise;
            };
            /**
             * asetetaan kysymys tyyppi muutujaan ja kysymys objektiin
             * @param questionType
             */
            this.setQuestionType = function(questionType){
                if(questionType.id === undefined){
                    _questionType = this.getType(questionType);
                    this.setType(questionType);
                }else{
                    this.setType(questionType.id);
                    _questionType = questionType;
                }
            };
            /**
             * palauttaa kysymystyyppi muuttujan
             * @returns {*} kysymystyyppi muuttuja
             */
            this.getQuestionType = function(){
                return _questionType;
            };
            /**
             * asetttaa kysymys datan muuttujaan sen id:llä HH:n taustajärjestelmästä
             * @param questionId kysymyksen id
             * @returns {promise} kysymys data
             */
            this.fetchQuestionData = function(questionId){
                $rootScope.LOGS('QuestionData ','fetchQuestionData() ',questionId);
                var defferred = $q.defer();
                ThemeQuestions.getThemeQuestionById(questionId).then(
                    function(data){
                        _question = data;
                        _applicationSystemId = _question.applicationSystemId;
                        defferred.resolve();
                    });
                return defferred.promise;
            };
            /**
             * palauttaa sekä alustaa kysymykseen liittyvät validaattorit
             * @returns {Array} lista kysymykseen liittyvistä validaattoreista
             */
            this.getQuestionTypeValidators = function(){
                var question = this.getQuestion();
                var editFlag = this.getEditFlag();
                var validators = [];
                $rootScope.LOGS('QuestionData ','getQuestionTypeValidators() ',question.type);
                switch(question.type){
                    case 'TextQuestion':

                        validators = this.getTextQuestionValidators();
                        break;

                    case 'CheckBox':

                        if(!editFlag){
                            question.options = [];
                            question.validators = {};
                            var optionObj = {};
                            optionObj.optionText ={};
                            optionObj.optionText.translations = {};
                            optionObj.id = 'option_0';
                            question.options[0] = optionObj;
                        }
                        validators = this.getCheckboxValidators();
                        break;

                    case 'RadioButton':

                        if(!editFlag){
                            question.options = [];
                            var radioObj = {};
                            radioObj.optionText ={};
                            radioObj.optionText.translations = {};
                            radioObj.id = 'option_0';
                            var radioObj2 = {};
                            radioObj2.optionText = {};
                            radioObj2.optionText.translations = {};
                            radioObj2.id = 'option_1';
                            question.options[0] = radioObj;
                            question.options[1] = radioObj2;
                        }
                        validators = this.getRadioValidators();
                        break;
                };
            return validators;
            };

        }]);
