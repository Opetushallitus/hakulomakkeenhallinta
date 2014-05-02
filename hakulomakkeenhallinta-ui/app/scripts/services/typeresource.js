'use strict';

angular.module('services.provider')
  .provider('TypeResource', function () {
        this.$get = ['$resource', 'Props',
            function($resource, Props) {
                return $resource(Props.typeUrl, {}, {});
            }
        ];
  });
