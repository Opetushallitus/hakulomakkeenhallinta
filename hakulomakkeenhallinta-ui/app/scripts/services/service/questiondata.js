'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.service')
    .service('QuestionData', [ 'FormEditor','$rootScope', 'ThemeQuestions', '$q',
        function (FormEditor, $rootScope, ThemeQuestions, $q ) {

        var _question = {};
        var _applicationSystemId;
        var _element ={};
        var _questionType;
        var _additionalQuestions = [];
        var _editFlag = false;
        var _applicationOption = null;

        this.setApplicationOption = function(applicationOption){
            _applicationOption = applicationOption;
        };

        this.getApplicationOption = function(){
            return _applicationOption;
        };

        this.getTextQuestionValidators = function(){
            return ['requiredFieldValidator', 'sizeFieldValidator' /*,'RegexFieldValidator'*/];
        };

        this.getCheckboxValidators = function(){
            return ['requiredFieldValidator', 'minValueValidator','maxValueValidator'];
        };

        this.getRadioValidators = function(){
            return [];
        };

        this.getEditFlag = function(){
            return _editFlag;
        };

        this.setEditFlag = function(flag){
            _editFlag = flag;
        };

        this.getAdditionalQuestions = function(){
            return _additionalQuestions;
        };

        function setAdditionalQuestions(question){
            _additionalQuestions.push(question);
        };

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
            _element = [];
            _questionType = '';
            _applicationSystemId;
        };

        this.setQuestion = function(question){
            _question = question;
            if(!_editFlag){
                setAdditionalQuestions(question);
            }
        };

        this.clearAdditonalQuestions = function(){
            _additionalQuestions = [];
        };

        this.getQuestion = function () {
            return _question;
        };

        this.setApplicatioSystemId = function(applicationSystemId){
            _applicationSystemId = applicationSystemId;
            _question.applicationSystemId = applicationSystemId;
        };

        this.getApplicationSystemId = function(){
            return _applicationSystemId;
        };

        this.setLearningOpportunityId = function(hakuOid){
            _question.learningOpportunityId = hakuOid;
        };

        this.getLerningOpportunityId = function(){
            return _question.learningOpportunityId;
        };

        this.setTheme = function(theme){
            $rootScope.LOGS('QuestionData ',106, theme);
            _question.theme = theme;
            if(_element.id === undefined){
                _element = this.getElement();
            }
        };

        this.getTheme = function(){
            return _question.theme;
        };

        this.setElement = function(element){
            if(element.id === undefined){
                _question.theme =element;
            }else{
                _question.theme = element.id;
                _element = element;
            }
        };

        this.getElement = function(){
            $rootScope.LOGS('QuestionData ',115, _element);
            /*if(_element.id === undefined){
                FormEditor.get({'_path':'application-system-form', '_id': _question.applicationSystemId } ).$promise.then(
                    function(data){
                        return data;
                    }
                );
            }*/
            return _element;
        };

        this.setType =  function(type){
            _question.type = type;
        };

        function getType (type){
            $rootScope.LOGS('QuestionData ',132, 'getType', type);
            var deffered = $q.defer();
            FormEditor.get({'_path': 'types', '_id': type}).$promise.then(
                function(data){
                    $rootScope.LOGS('QuestionData ',138, 'getType', data);
                    deffered.resolve(data);
                });
            return deffered.promise;
        };

        this.setQuestionType = function(questionType){
            if(questionType.id === undefined){
                _questionType = getType(questionType);
                this.setType(questionType);
            }else{
                this.setType(questionType.id);
                _questionType = questionType;
            }

        };

        this.getQuestionType = function(){
            return _questionType;
        };

        this.setQuestionData = function(questionId){
            var defferred = $q.defer();
            ThemeQuestions.get({'_id':questionId}).$promise.then(
                function(data){
                    _question = data;
                    defferred.resolve();
                });
            return defferred.promise;
        };

    }]);
