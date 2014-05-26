'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.service')
    .service('QuestionData', function () {

        var _question = {};
        var _applicationSystem = {};
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
            return ['RequiredFieldValidator', 'SizeFieldValidator'/*,'RegexFieldValidator'*/];
        };

        this.getCheckboxValidators = function(){
            return ['RequiredFieldValidator'];
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
            _applicationSystem = {};
        };

        this.setQuestion = function(question){
            _question = question;
            if(!_editFlag){
                setAdditionalQuestions(question);
            }
        };

        this.clearAdditonalQuestions = function(){
            _additionalQuestions = [];
        }

        this.getQuestion = function () {
            return _question;
        };

        this.setApplicatioSystem = function(applicationSystem){
            _applicationSystem = applicationSystem;
            _question.applicationSystemId = applicationSystem._id;
        };

        this.getApplicationSystem = function(){
            return _applicationSystem;
        };

        this.setPrefrence = function(prefrence){
            _question.learningOpportunityId = prefrence;
        };

        this.getPrefrence = function(){
            return _question.learningOpportunityId;
        };

        this.setElement = function(element){
            _question.theme = element._id;
            _element = element;
        };

        this.getElement = function(){
            return _element;
        };

        this.setQuestionType = function(questionType){
            _question.type = questionType.id;
            _questionType = questionType;
        };

        this.getQuestionType = function(){
            return _questionType;
        };

    });
