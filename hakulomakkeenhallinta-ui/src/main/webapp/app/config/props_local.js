'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.provider', [])
    .provider('Props', function () {
        this.$get = [function () {
            return {
                enableConsoleLogs: true,
                tarjontaAPI: 'https://itest-virkailija.oph.ware.fi/tarjonta-service/rest/v1',
                contextRoot: '/hakulomakkeenhallinta-ui',
                themeQuestionUri: 'http://localhost/haku-app/application-system-form-editor/theme-question',
                formConfigurationUri: 'http://localhost/haku-app/application-system-form-editor/configuration',
                formEditorUri: 'http://localhost/haku-app/application-system-form-editor',
                authService: 'https://itest-virkailija.oph.ware.fi/authentication-service',
                organisaatioService: 'https://itest-virkailija.oph.ware.fi/organisaatio-service',
                backEndRoot : 'http://localhost/',
                localizationUrl: 'https://itest-virkailija.oph.ware.fi/lokalisointi/cxf/rest/v1',
                koodisto: 'https://itest-virkailija.oph.ware.fi/koodisto-service/rest/json',
                casurl: '/cas/myroles'
            };
        }]
    });
