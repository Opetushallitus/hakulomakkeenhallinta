'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.service')
    .service('Resources', [ '$resource', function ($resource) {
        return {
            applicationOptions: $resource('http://itest-virkailija.oph.ware.fi:8325/hakulomakkeenhallinta-ui/app/test-data/applicationOptions.json'),
            additionalQuestions: $resource('http://itest-virkailija.oph.ware.fi:8325/hakulomakkeenhallinta-ui/app/test-data/additionalQuestions.json'),
//            languages: $resource('http://itest-virkailija.oph.ware.fi:8325/hakulomakkeenhallinta-ui/app/test-data/languages.json')
            languages: $resource('/app/test-data/languages.json')
        };
    }]);
