'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.service')
  .factory('QuestionData', function () {

        var question = {};
        question._id = "";
        question.i18nText = {};
        question.i18nText.translations = {};
        question.verboseHelp = {};
        question.verboseHelp.translations ={};
        question.additionalHelp ={};
        question.additionalHelp.translations ={};
        question.additionalHelp.link ={};
        question._class= "";

        var applicationSystem = {};
        var element ={};
        var questionType;

    return {
        setQuestion: function(questn){
            question = questn;
        },
        getQuestion: function () {
            return question;
        },
        setApplicatioSystem: function(appSys){
            applicationSystem = appSys;
        },
        getApplicationSystem: function(){
            return applicationSystem;
        },
        setElement: function(elm){
            element = elm;
        },
        getElement: function(){
            return element;
        },
        setQuestionType: function(questnType){
            questionType = questnType;
        },
        getQuestionType: function(){
            return questionType;
        }

    };
  });
