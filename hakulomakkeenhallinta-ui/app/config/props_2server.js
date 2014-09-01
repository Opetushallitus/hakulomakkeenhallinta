'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.provider', [])
    .provider('Props', function () {
        this.$get = [function () {
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
        }]
    });
