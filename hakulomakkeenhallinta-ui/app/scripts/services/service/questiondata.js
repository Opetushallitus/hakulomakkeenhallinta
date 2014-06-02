'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.service')
    .service('QuestionData', [ 'FormEditor','$rootScope', function (FormEditor, $rootScope) {

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
            return ['requiredFieldValidator', 'sizeFieldValidator'/*,'RegexFieldValidator'*/];
        };

        this.getCheckboxValidators = function(){
            return ['requiredFieldValidator'];
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
        }

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

        this.setElement = function(element){
            _question.theme = element.id;
            _element = element;
        };

        this.getElement = function(){
            $rootScope.LOGS('QuestionData ',106, _element);
            if(_element.id === undefined){
                FormEditor.get({'_path':'application-system-form', '_id': _question.applicationSystemId } ).$promise.then(
                    function(data){

                    }
                );
            }
            return _element;
        };

        this.setQuestionType = function(questionType){
            _question.type = questionType.id;
            _questionType = questionType;
        };

        this.getQuestionType = function(){
            return _questionType;
        };

    }]);
