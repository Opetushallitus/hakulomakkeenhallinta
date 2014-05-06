'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.provider')
  .provider('ASFResource', function () {
        this.$get = ['$resource', 'Props',
            function($resource, Props) {
                return $resource(Props.asfUrl, {}, {
                    update: {
                        method: 'PUT'
                    }
                });
            }
        ];
  });
