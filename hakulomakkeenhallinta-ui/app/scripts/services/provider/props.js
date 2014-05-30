'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.provider')
    .provider('Props', function () {
        this.$get = [function() {
            if (location.hostname.indexOf('localhost') != -1) {
                return {
                    koodistoUrl: 'https://itest-virkailija.oph.ware.fi/koodisto-service/rest/json/',
                    tarjontaUrl: 'https://itest-virkailija.oph.ware.fi/tarjonta-service/rest/v1/',
                    asfUrl: 'http://localhost:8080/hakulomakkeenhallinta-temporary/application-system-form/:_id',
                    typeUrl: 'http://localhost:8080/hakulomakkeenhallinta-temporary/type/:id',
                    formUrl: 'http://localhost:8080/hakulomakkeenhallinta-temporary/form/:_id',
                    tarjontaAPI: 'https://itest-virkailija.oph.ware.fi/tarjonta-service/rest/v1',
                    contextRoot: '',
                    themeQuestionUri: 'http://localhost:9090/haku-app/application-system-form-editor/theme-question',
                    formEditorUri: 'http://localhost:9090/haku-app/application-system-form-editor',
                    authService: 'https://itest-virkailija.oph.ware.fi/authentication-service',
                    organisaatioService: 'https://itest-virkailija.oph.ware.fi/organisaatio-service',
                    backEndRoot : 'http://localhost:9090/'
                };
            } else {
                return {
                    koodistoUrl: 'https://itest-virkailija.oph.ware.fi/koodisto-service/rest/json/',
                    tarjontaUrl: 'https://itest-virkailija.oph.ware.fi/tarjonta-service/rest/v1/',
                    asfUrl:  'http://itest-virkailija.oph.ware.fi:8325/hakulomakkeenhallinta-temporary/application-system-form/:_id',
                    typeUrl: 'http://itest-virkailija.oph.ware.fi:8325/hakulomakkeenhallinta-temporary/type/:id',
                    formUrl: 'http://itest-virkailija.oph.ware.fi:8325/hakulomakkeenhallinta-temporary/form/:_id',
                    tarjontaAPI: '/tarjonta-service/rest/v1',
                    contextRoot: '/hakulomakkeenhallinta-ui',
                    themeQuestionUri: '/haku-app/application-system-form-editor/theme-question',
                    formEditorUri: '/haku-app/application-system-form-editor',
                    authService: '/authentication-service',
                    organisaatioService: '/organisaatio-service',
                    backEndRoot : '/'
                };

            }
        }]
    });
