'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.provider')
  .provider('TypeResource', function () {
        this.$get = ['$resource', 'Props',
            function($resource, Props) {
                return $resource(Props.typeUrl, {}, {});
            }
        ];
  });
