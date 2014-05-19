'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.service')
    .service('QuestionData', function () {

        var _question = {};
        var questionTypePrefix = "fi.vm.sade.haku.oppija.lomake.domain.elements.questions.";
        var _applicationSystem = {};
        var _element ={};
        var _questionType;
        var _additionalQuestions = [];

        this.getAdditionalQuestions = function(){
            return _additionalQuestions;
        };

        function setAdditionalQuestions(question){
            _additionalQuestions.push(question);
        };

        this.newAdditionalQuestion = function(){
            _question = {};
            _question.parentElement_id;
            _question._id = "";
            _question.i18nText = {};
            _question.i18nText.translations = {};
            _question.verboseHelp = {};
            _question.verboseHelp.translations ={};
            _question.additionalHelp ={};
            _question.additionalHelp.translations ={};
            _question.additionalHelp.link ={};
            _question._class= "";

            _element = [];
            _questionType = '';
            _applicationSystem = {};
        };

        this.setQuestion = function(question){
            _question = question;
            setAdditionalQuestions(question);
        };

        this.getQuestion = function () {
            return _question;
        };

        this.setApplicatioSystem = function(applicationSystem){
            _applicationSystem = applicationSystem;
        };

        this.getApplicationSystem = function(){
            return _applicationSystem;
        };

        this.setElement = function(element){
            _question.parentElement_id = element._id;
            _element = element;
        };

        this.getElement = function(){
            return _element;
        };

        this.setQuestionType = function(questionType){
            _question._class =  questionTypePrefix + questionType.id;
            _questionType = questionType;
        };

        this.getQuestionType = function(){
            return _questionType;
        };

    });
