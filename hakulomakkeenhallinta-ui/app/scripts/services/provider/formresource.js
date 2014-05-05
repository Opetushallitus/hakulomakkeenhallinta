'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.provider')
    .provider('FormResource', function () {
        this.$get = ['$resource','Props',
            function($resource, Props) {
                var Form = $resource(Props.formUrl, {}, {
                    update: {
                        method: 'PUT'
                    }
                });
                return Form;
            }
        ];
    });
