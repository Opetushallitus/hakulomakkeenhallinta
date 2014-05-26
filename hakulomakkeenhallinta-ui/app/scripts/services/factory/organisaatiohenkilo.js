'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.factory')
    .factory('OrganisaatioHenkilo',[ '$resource', 'Props', function ($resource, Props) {
        console.log('***** OrganisaatioHenkilo ****');
        return $resource(Props.authService+'/resources/organisaatiohenkilo/organisaatios',
            {}, {}
        );
    }]);

