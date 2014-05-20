'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.service')
    .service('QuestionData', function () {

        var _question = {};
        var questionTypePrefix = "fi.vm.sade.haku.oppija.lomake.domain.elements.questions.";
        var _applicationSystem = {};
        var _element ={};
        var _questionType;
        var _additionalQuestions = [];
        var _editFlag = false;

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
            _question.message = {};
            _question.message.translations = {};
            _question.verboseHelp = {};
            _question.verboseHelp.translations ={};
            _question.additionalHelp ={};
            _question.additionalHelp.translations ={};
            _question.type= ""; //type
            _question.applicationSystemId= "";
            _question.preference = "";
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
            _question.preference = prefrence;
        }

        this.getPrefrence = function(){
            return _question.preference;
        }

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
