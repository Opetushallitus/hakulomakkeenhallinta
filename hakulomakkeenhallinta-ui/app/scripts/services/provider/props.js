'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.provider', [])
    .provider('Props', function () {
        this.$get = [function() {
            if (location.hostname.indexOf('localhost') !== -1) {
                return {
                    enableConsoleLogs: true,
                    tarjontaAPI: 'https://itest-virkailija.oph.ware.fi/tarjonta-service/rest/v1',
                    contextRoot: '',
                    themeQuestionUri: 'http://localhost:9090/haku-app/application-system-form-editor/theme-question',
                    formEditorUri: 'https://itest-virkailija.oph.ware.fi/haku-app/application-system-form-editor',
                    authService: 'https://itest-virkailija.oph.ware.fi:443/authentication-service',
                    organisaatioService: 'https://itest-virkailija.oph.ware.fi/organisaatio-service',
                    backEndRoot : 'http://localhost:9090/',
                    localizationUrl: 'https://itest-virkailija.oph.ware.fi/lokalisointi/cxf/rest/v1',
                    koodisto: 'https://itest-virkailija.oph.ware.fi:443/koodisto-service/rest/json'
                };
            } else {
                return {
                    enableConsoleLogs: false,
                    tarjontaAPI: '/tarjonta-service/rest/v1',
                    contextRoot: '/hakulomakkeenhallinta-ui',
                    themeQuestionUri: '/haku-app/application-system-form-editor/theme-question',
                    formEditorUri: '/haku-app/application-system-form-editor',
                    authService: '/authentication-service',
                    organisaatioService: '/organisaatio-service',
                    backEndRoot : '/',
                    localizationUrl: '/lokalisointi/cxf/rest/v1',
                    koodisto: '/koodisto-service/rest/json'
                };

            }
        }]
    });
