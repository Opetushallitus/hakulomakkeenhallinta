'use strict';

var app = angular.module('hakulomakkeenhallinta', [
        'ngRoute',
        'ngResource',
        'ui.bootstrap',
        'jm.i18next',
        'hakulomakkeenhallintaUiApp.filters',
        'hakulomakkeenhallintaUiApp.directives',
        'hakulomakkeenhallintaUiApp.services.provider',
        'hakulomakkeenhallintaUiApp.services.service',
        'hakulomakkeenhallintaUiApp.services.util',
        'hakulomakkeenhallintaUiApp.services.factory',
        'hakulomakkeenhallintaUiApp.controllers'
        /*,'ngMockE2E'*/
    ]);

   app.config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/applicationSystemForm', {
                templateUrl: 'partials/applicationSystemFormIndex.html'
            });

            $routeProvider.when('/applicationSystemForm/:id', {
                templateUrl: 'partials/applicationSystemForm.html',
                controller: 'ApplicationSystemFormCtrl'
            });
            $routeProvider.when('/applicationSystemForm/:id/:eid', {
                templateUrl: 'partials/elements/edit/Element.html',
                controller: 'ApplicationSystemFormCtrl'
            });
            $routeProvider.when('/additionalQuestion/:id/:aoid', {
                templateUrl: 'partials/additionalQuestions.html',
                controller: 'AdditionalQuestionsCtrl'
            });
            $routeProvider.when('/additionalQuestion/:id/:aoid/:eid', {
                templateUrl: 'partials/lisakysymykset/kysymystekstit.html',
                controller: 'CreateAdditionalQuestionCtrl'
            });
            $routeProvider.when('/applicationSystem', {
                templateUrl: 'partials/applicationSystem.html'
            });
            $routeProvider.when('/themeQuestionsByOrganisation/:orgid', {
                templateUrl: 'partials/lisakysymykset/kysymystekstit.html',
                controller: 'CreateAdditionalQuestionCtrl'
            });
            $routeProvider.when('/applicationSystems', {
                templateUrl: 'partials/applicationForms.html'
            });
            $routeProvider.when('/applicationSystems/:applicationFormId/:applicationOptionId', {
                templateUrl: 'partials/additionalQuestions.html',
                controller: 'AdditionalQuestionsCtrl'
            });
            $routeProvider.otherwise({
                redirectTo: '/applicationSystemForm'
            });
        }
    ]);

    app.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }]);

    app.config(['$i18nextProvider',
        function($i18nextProvider) {
            $i18nextProvider.options = {
                resGetPath: 'locales/__ns__-__lng__.json',
                lng: 'fi',
                ns: 'language',
                getAsync: false,
                sendMissing: false,
                fallbackLng: 'fi',
                debug: false
            };
        }
    ])

    app.provider('_', function() {
        this.$get = [
            function() {
                return window._;
            }
        ];
    });

    app.run(['$rootScope', function($rootScope){
        $rootScope.devFlag = true;
    }]);

    /*app.run(function($httpBackend, Props, $rootScope, FormWalker){
        //kehitys vaiheen ominaisuuksien disaploiminen
        $rootScope.devFlag = true;
        console.log('**** $httpBackkend mock ****');
        //hakulomake mockki
        var hakuLomake = null;
        //hakulomakkeiden mockki
        var hakuLomakkeet = [];
        //mallipohjien mockki
        var malliPohjat = [];
        //lisäkysymysten tyypit mockki
        var lisakysymysTyypit = [];
        //kielten mock
        var languages = [];
        //lisakysmykset
        var lisakysymykset ={};

        var mockUrl = '/hakulomakkeenhallinta-mock';

        //applicationSystems localstorage tallennus
        if(localStorage.getItem('hakuLomake') === null){
            $.getJSON(Props.contextRoot+'/app/test-data/1.2.246.562.5.2014022711042555034240.json', function(data){
                console.log('mock data hakulomake -->');
                console.log(localStorage.getItem('hakuLomake'));
                localStorage.setItem('hakuLomake', JSON.stringify(data));
                hakuLomake = data;

            });
        }else{
            console.log('lomake localStoragesta');
            hakuLomake = localStorage.getItem('hakuLomake');
//            console.log(hakuLomake);
        }

        //hakulomake lista mock data
        $.getJSON(Props.contextRoot+'/app/test-data/application-system-forms.json', function(data){
            console.log('mock data json hakulomakkeet ');
            hakuLomakkeet = data;
        });

        //lisakymystyypit mock data
        $.getJSON(Props.contextRoot+'/app/test-data/types.json', function(data){
            console.log('mock data json lisäkysmys tyypeille ');
            lisakysymysTyypit = data;
        });

        //languages mock data
        $.getJSON(Props.contextRoot+'/app/test-data/languages.json', function(data){
            console.log('mock data json kielet');
            languages = data;
        });

        //application system lisäkysymysten haku
        *//*$httpBackend.whenGET(Props.backEndRoot+'haku-app/lomakkeenhallinta/themequestion/1.2.246.562.5.2014022711042555034240/1.2.246.562.20.23099745319').respond(
            function (method, url){
                console.log('***** haettiin lisäkysymykset **** \n',url );
                //lisakymysten tietovaraston mock localStorageen
                if(localStorage.getItem('additionalQuestions') !== null){
                    console.log('***** additionalQuestions haetaan localStoragesta ----->');
                    lisakysymykset.additionalQuestions = [];
                    lisakysymykset.additionalQuestions = localStorage.getItem('additionalQuestions');
                }
                return [ 200, lisakysymykset, {status:200, message:'haettiin lisakysmykset'}];
            });*//*

        $httpBackend.whenGET(Props.backEndRoot+'haku-app/lomakkeenhallinta/themequestion/asId').passThrough();
        $httpBackend.whenGET(Props.backEndRoot+'haku-app/lomakkeenhallinta/themequestion/haku1').passThrough();
        $httpBackend.whenGET(Props.backEndRoot+'haku-app/lomakkeenhallinta/themequestion/application-system-form/haku1').passThrough();
        //lomakkeen haku
        *//*$httpBackend.whenGET(Props.backEndRoot+'haku-app/lomakkeenhallinta/themequestion/1.2.246.562.5.2014022711042555034240').respond(

            function (method, url){
                console.log('***** haettiin lomake **** \n',url );
                return [ 200, hakuLomake, {status:200, message:'haettiin hakulomake'}];
            });*//*

        $httpBackend.whenGET(Props.backEndRoot+'haku-app/lomakkeenhallinta/themequestion/application-system-form').passThrough();
        //hakulomakkeet listan mock
*//*        $httpBackend.whenGET(Props.backEndRoot+'haku-app/lomakkeenhallinta/themequestion').respond(
            function(method, url, data){
                console.log('hakulomake lista' );
                return [ 200, hakuLomakkeet, {status:200, message:'haettiin hakulomakkeet'}];
            });*//*

        //Mallipohjien lista mock
        $.getJSON(Props.contextRoot+'/app/test-data/applicationFormTemplates.json', function(data){
            console.log('mock data json malli pohjat ');
            malliPohjat = data;
        });

        $httpBackend.whenGET(/\haku-app\/lomakkeenhallinta\/themequestion\/form/).respond(function(){
            console.log('saatiin mallipohjat')
            return [200, malliPohjat, {status:200, message: 'saatiin mallipohjat' }];
        });

        //tallenetaan muokattu lisäkysmys
        $httpBackend.whenPOST(/\haku-app\/lomakkeenhallinta\/themequestion\/1\.2\.246\.562\.5\.2014022711042555034240\/1\.2\.246\.562\.20\.23099745319\/\d/).respond(
            function(method, url, data, headers){
                console.log('tallentaan lisäkysymyksen muokkaus \n', method, '\n', url );
                var additionalQuestionsLS =[];
                var qid = url.substr(url.lastIndexOf('/')+1);
                additionalQuestionsLS = JSON.parse(localStorage.getItem('additionalQuestions'));
                for(var question in additionalQuestionsLS){
                    var qidLS = additionalQuestionsLS[question]._id;
                    if(qidLS.toString().match(qid) != null){
                        //remove old data
                        additionalQuestionsLS.splice(question, 1);
                        //add modified data
                        additionalQuestionsLS.push(JSON.parse(data));
                        localStorage.setItem('additionalQuestions', JSON.stringify(additionalQuestionsLS));
                        return [200, {status:200, message: 'muokkauksen tallennus onnistui'}];
                    }
                }
                return [400];

            });


        //luodaan uusi lisäkysmys oikeaa backendiä vasten
       $httpBackend.whenPOST(/\haku-app\/lomakkeenhallinta\/themequestion\/haku1\/\w/).passThrough();

//   luodaan uusi lisäkysmys mock backend
*//*        $httpBackend.whenPOST(/\haku-app\/lomakkeenhallinta\/themequestion\/1\.2\.246\.562\.5\.2014022711042555034240\/1\.2\.246\.562\.20\.23099745319/).respond(
            function(method, url, data, headers){
                console.log('**** lisäkysmyksen tallenenus ***');
                console.log('method ---- ', method);
                console.log('url ---- ', url);
                console.log('data ---- ', data, '\n\n');
                //luodaan fake id lisäkysmselle
                var json_object = JSON.parse(data);
                json_object._id = Math.floor(Math.random() * 1e15);
                console.log('Luodaan fake id lisäkysmykselle: ',json_object._id);

                var additionalQuestionsLS = [];
                if(localStorage.getItem('additionalQuestions') === null){
                    additionalQuestionsLS.push(json_object);
                    localStorage.setItem('additionalQuestions', JSON.stringify(additionalQuestionsLS));
                }else{
                    additionalQuestionsLS = JSON.parse(localStorage.getItem('additionalQuestions'));
                    additionalQuestionsLS.push(json_object);
                    localStorage.setItem('additionalQuestions', JSON.stringify(additionalQuestionsLS));
                }
                console.dir(additionalQuestionsLS);
                console.log(JSON.stringify(json_object));
                return [200, json_object, {status:200, message: '' }];
            }
        );*//*
        $httpBackend.whenGET(/\haku-app\/lomakkeenhallinta\/themequestion\/haku1\/\w/).passThrough();
        //heataan lisäkysmys muokattavaksi
        *//*$httpBackend.whenGET(/\haku-app\/lomakkeenhallinta\/themequestion\/1\.2\.246\.562\.5\.2014022711042555034240\/1\.2\.246\.562\.20\.23099745319\/\d/).respond(
            function(method, url, data, headers){
                console.log('avataan lisäkysymys muokattavaksi \n', method, '\n', url );
                var additionalQuestionsLS =[];
                var qid = url.substr(url.lastIndexOf('/')+1);
                additionalQuestionsLS = JSON.parse(localStorage.getItem('additionalQuestions'));
                for(var question in additionalQuestionsLS){
                    var qidLS = additionalQuestionsLS[question]._id;
                    if(qidLS.toString().match(qid) != null){
                        console.log('palautetaan lisäkymys ',JSON.stringify(additionalQuestionsLS[question]));
                        return [200, JSON.stringify(additionalQuestionsLS[question]), {status:200, message: 'lisäkysmys löytyi'}];
                    }
                }
                return [404];
            });*//*


        //poistetaan lisäkysymys
        $httpBackend.whenDELETE(/\haku-app\/lomakkeenhallinta\/themequestion\/1\.2\.246\.562\.5\.2014022711042555034240\/1\.2\.246\.562\.20\.23099745319\/\d/).respond(
            function(method, url, data, headers){
                console.log('poistetaan lisäkysymys \n', method, '\n', url );
                var additionalQuestionsLS =[];
                var qid = url.substr(url.lastIndexOf('/')+1);
                additionalQuestionsLS = JSON.parse(localStorage.getItem('additionalQuestions'));
                for(var question in additionalQuestionsLS){
                    var qidLS = additionalQuestionsLS[question]._id;
                    if(qidLS.toString().match(qid) != null){
                        //remove old data
                        additionalQuestionsLS.splice(question, 1);
                        //add modified data
                        localStorage.setItem('additionalQuestions', JSON.stringify(additionalQuestionsLS));
                        return [200, {status:200, message: 'muokkauksen tallennus onnistui'}];
                    }
                }
                return [400];

            });

        //haun ja hakulomakkeen liittäminen toisiinsa
        $httpBackend.whenPOST(/\hakulomakkeenhallinta-mock\/application-system-form/).respond(
            function(method, url, data, headers){
                console.log('PUT url ---- ', method);
                console.log('PUT url ---- ', url);
                console.log('PUT data ---- ', data, '\n\n');
                console.log(JSON.parse(data).applicationFormTemplate._id);
                var id = JSON.parse(data).applicationFormTemplate._id;
                if(id === '1.2.246.562.5.2013111213130760225065'){
                    return [400, {status:400, message: 'liittämnen ei onnistunut' }];
                }
                return [200, {status:200, message: 'liittäminen OK' }];
            }
        );

        //hakulomakkeen poisto id:llä
        $httpBackend.whenDELETE(/\hakulomakkeenhallinta-mock\/application-system-form\/\d/).respond(
            function(data, url){
                console.log('--- DELETE tämä ei vielä tee mitään ---', url);
                var id = url.substr(url.lastIndexOf('/')+1);
                console.log(id);
                if(id === '1.2.246.562.5.2013111213130760225065'){
                    return [400 , {status: 400, message: 'poisto ei onnistunut'}];
                }
                return [200 , {status: 200, message: 'hakulomakkeen poisto'}];
            });

        //mallipohjan poisto id:llä
        $httpBackend.whenDELETE(/\hakulomakkeenhallinta-mock\/form\/\d/).respond(
            function(data, url){
                console.log('--- DELETE mallipohja ---', url);
                var id = url.substr(url.lastIndexOf('/')+1);
                console.log(id);
                if(id === '1.2.246.562.5.2013111213130760225065'){
                    return [400 , {status: 400, message: 'mallipohjan poisto ei onnistunut'}];
                }
                return [200 , {status: 200, message: 'mallipohjan poisto'}];
            });


        $httpBackend.whenGET(Props.backEndRoot+'haku-app/lomakkeenhallinta/themequestion/types').passThrough();
        //lisäkysymys tyypit mock
        *//*$httpBackend.whenGET(Props.backEndRoot+'haku-app/lomakkeenhallinta/themequestion/types').respond(
            function( method, url){
                console.log('-- Lisäkysymys tyypit ', url);
                return [200, lisakysymysTyypit ,{status:200, message:' lisäkysymys tyypit'}];
            }
        );*//*

        $httpBackend.whenGET(/\haku-app\/lomakkeenhallinta\/themequestion\/languages/).passThrough();
        //kielet mock
*//*        $httpBackend.whenGET(/\haku-app\/lomakkeenhallinta\/themequestion\/languages/).respond(
            function( method, url){
                console.log('******* Languages *****');
                return [200, languages ,{status:200, message:'Haettiin kielet'}];
            }
        );*//*

        //tarjonan api käyttö
        $httpBackend.whenGET(/tarjonta-service\/rest\/v1\//).passThrough();
        $httpBackend.whenGET(/test-data\//).passThrough();
        $httpBackend.whenGET(/app\/test-data\/languages.json/).passThrough();
        $httpBackend.whenGET(/\partials\//).passThrough();
        $httpBackend.whenGET(/\hakulomakkeenhallinta-temporary\//).passThrough();
        $httpBackend.whenPUT(/\hakulomakkeenhallinta-temporary\//).passThrough();
        $httpBackend.whenPUT(/\haku-app\/lomakkeenhallinta\/themequestion\//).passThrough();
        $httpBackend.whenGET('https://itest-virkailija.oph.ware.fi/authentication-service/resources/organisaatiohenkilo/organisaatios').passThrough();
        $httpBackend.whenGET(/\authentication-service\/resources\/organisaatiohenkilo\/organisaatios/).passThrough();


        $httpBackend.whenGET(/\haku-app\/lomakkeenhallinta\/themequestion\//).respond(
            function(data, url, method){
            console.log('uusi api ', url);
            console.log('uusi api ', method);
            return [200];
            }
        );

    });*/

