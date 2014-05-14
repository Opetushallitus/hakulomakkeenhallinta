'use strict';

angular.module('hakulomakkeenhallinta', [
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
        ,'ngMockE2E'
    ])

    .config(['$routeProvider',
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
            //WIP
            $routeProvider.when('/additionalQuestion/:id/:aoid/:aqid', {
                templateUrl: 'partials/element/new.html',
                controller: 'AdditionalQuestionsCtrl' //tälle oma controlleri
            });
            $routeProvider.when('/applicationSystem', {
                templateUrl: 'partials/applicationSystem.html'
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
    ])
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }])

    .config(['$i18nextProvider',
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
    .provider('_', function() {
        this.$get = [

            function() {
                return window._;
            }
            ];
    })

    .run(function($httpBackend, Props){
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

        var mockUrl = '/hakulomakkeenhallinta-mock';

        if(localStorage.getItem('hakuLomake') === null){
            $.getJSON(Props.contextRoot+'/app/test-data/form.json', function(data){
                console.log('mock data hakulomake -->',  hakuLomake);
                console.log(localStorage.getItem('hakuLomake'));

                localStorage.setItem('hakuLomake', JSON.stringify(data));

                hakuLomake = data;
            });
        }else{
            console.log('lomake localStoragesta');
            hakuLomake = localStorage.getItem('hakuLomake');
        }

        $.getJSON(Props.contextRoot+'/app/test-data/applicationSystems.json', function(data){
            console.log('mock data json hakulomakkeet ');
            hakuLomakkeet = data;
        });

        $.getJSON(Props.contextRoot+'/app/test-data/types.json', function(data){
            console.log('mock data json lisäkysmys tyypeille ');
            lisakysymysTyypit = data;
        });

        $.getJSON(Props.contextRoot+'/app/test-data/languages.json', function(data){
            console.log('mock data json kielet');
            languages = data;
        });

//        $httpBackend.whenGET(/\hakulomakkeenhallinta-temporary\/application-system-form\/\d/).respond(
        $httpBackend.whenGET(mockUrl+'/application-system-form/1.2.246.562.5.2013100416514851336462').respond(
            function (method, url){
                console.log('***** haettiin lomake **** \n',url );
                return [ 200, hakuLomake, {status:200, message:'haettiin hakulomake'}];
                //mock virhe tapauksessa
//                return [ 404, {status:404, message:'hakulomaketta ei löydy'}];
            });

//        $httpBackend.whenGET(/\hakulomakkeenhallinta-temporary\/application-system-form/).respond(
        $httpBackend.whenGET(mockUrl+'/application-system-form').respond(
            function(method, url, data){
//            console.log('#########',url, data);
            /*var id = url.substr(url.lastIndexOf('/')+1);
            console.log(id);
            if(id.search('1.2.246') !== -1){
                console.log('*******');
                return [ 200, hakuLomake, {status:200, message:'heattiin hakulomake'}];
                //mock virhe tapauksessa
//                return [ 404, {status:404, messages:'hakulomaketta ei löydy'}];
            }*/
            return [ 200, hakuLomakkeet, {status:200, message:'haettiin hakulomakkeet'}];
            //mock virhe tapauksessa
//            return [ 404, {status:404, messages:'ei löydy hakulomakkeita'}];
        });


        $.getJSON(Props.contextRoot+'/app/test-data/applicationFormTemplates.json', function(data){
            console.log('mock data json malli pohjat ');
            malliPohjat = data;
        });
        $httpBackend.whenGET(/\hakulomakkeenhallinta-mock\/form/).respond(function(){
            return [200, malliPohjat, {status:200, message: 'saatiin mallipohjat' }];
            //mock virhe tapauksessa
//            return [404,  {status:404, message: 'ei löydy' }];
        });



        //hakulomakkeen poisto id:llä
        $httpBackend.whenDELETE(/\hakulomakkeenhallinta-mock\/application-system-form\/(\d)/).respond(
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
        $httpBackend.whenDELETE(/\hakulomakkeenhallinta-mock\/form\/(\d)/).respond(
            function(data, url){
                console.log('--- DELETE mallipohja tämä ei vielä tee mitään ---', url);
                var id = url.substr(url.lastIndexOf('/')+1);
                console.log(id);
                if(id === '1.2.246.562.5.2013111213130760225065'){
                    return [400 , {status: 400, message: 'mallipohjan poisto ei onnistunut'}];
                }
                return [200 , {status: 200, message: 'mallipohjan poisto'}];
            });

        //haun ja hakulomakkeen liittäminen toisiinsa
        $httpBackend.whenPUT(/\hakulomakkeenhallinta-mock\/application-system-form/).respond(
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
        //luodaan uusi lisäkysmys
        $httpBackend.whenPOST(mockUrl+'/application-system-form/1.2.246.562.5.2013100416514851336462/HenkilotiedotGrp').respond(
            function(method, url, data, headers){
                console.log('**** lisäkysmyksen tallenenus ***');
                console.log('method ---- ', method);
                console.log('url ---- ', url);
                console.log('data ---- ', data, '\n\n');
                //luodaan fake id lisäkysmselle
                var json_object = JSON.parse(data);
                json_object._id = 9;
                json_object.validators[0].fieldName = 9;
                console.log(JSON.stringify(json_object));

                return [200, json_object, {status:200, message: '' }];
            }
        );

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
        //lisäkysymys tyypit
        $httpBackend.whenGET(mockUrl+'/type').respond(
            function( method, url){
                console.log('-- Lisäkysymys tyypit ', url);
                return [200, lisakysymysTyypit ,{status:200, message:' lisäkysymys tyypit'}];
            }
        )

        //kielet
        $httpBackend.whenGET(mockUrl+'/languages').respond(
            function( method, url){
                console.log('-- Kielet ', url);
                return [200, languages ,{status:200, message:'Haettiin kielet'}];
            }
        )
        //tarjonan api käyttö
        $httpBackend.whenGET(/tarjonta-service\/rest\/v1\//).passThrough();

        $httpBackend.whenGET(/test-data\//).passThrough();
//        $httpBackend.whenGET(/\hakulomakkeenhallinta-temporary\/form/).passThrough();

        $httpBackend.whenGET(/app\/test-data\/languages.json/).passThrough();
        $httpBackend.whenGET(/\partials\//).passThrough();

        $httpBackend.whenGET(/\hakulomakkeenhallinta-mock\/application-system-form\/(\d)/).respond(
            function(method, url, data){
                console.log( url);
            }
        );

    });

