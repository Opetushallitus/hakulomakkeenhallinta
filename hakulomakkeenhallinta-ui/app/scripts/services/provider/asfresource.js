'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.provider')
  .provider('ASFResource', function () {
        this.$get = ['$resource', 'Props',
            function($resource, Props) {
                var Form = $resource(Props.asfUrl, {}, {
                    update: {
                        method: 'PUT'
                    }
                });
                return Form;
            }
        ];
  });
