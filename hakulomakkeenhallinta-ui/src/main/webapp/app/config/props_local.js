'use strict';

window.urls.addOverride({
  "tarjonta-service.baseUrl": 'https://itest-virkailija.oph.ware.fi',
  "haku-app.baseUrl": 'http://localhost',
  "authentication-service.baseUrl": 'https://itest-virkailija.oph.ware.fi',
  "organisaatio-service.baseUrl": 'https://itest-virkailija.oph.ware.fi',
  "lokalisointi.baseUrl": 'https://itest-virkailija.oph.ware.fi',
  "koodisto-service.baseUrl": 'https://itest-virkailija.oph.ware.fi'
})

angular.module('hakulomakkeenhallintaUiApp.services.provider', [])
  .provider('Props', function () {
    this.$get = [function () {
      return {
        enableConsoleLogs: true
      };
    }]
  });
