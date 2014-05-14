'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.factory')
    .factory('Languages', [ '$resource', 'Props', function ($resource, Props) {
        console.log('****** Languages service factory ***');
        return $resource(Props.serviceRootUri+'/languages/:id', {id:'@id'}, {});
    }]);