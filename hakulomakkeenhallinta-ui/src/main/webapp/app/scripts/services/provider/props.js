'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.provider', [])
    .provider('Props', function () {
        this.$get = [function () {
            return {
                enableConsoleLogs: false,
                contextRoot: '/hakulomakkeenhallinta-ui',
                localizationUrl: '/lokalisointi/cxf/rest/v1',
            };
        }]
    });
