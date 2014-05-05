'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('FormtemplatesCtrl', ['$scope', '_', 'FormResource', '$i18next',
        function($scope, _, FormResource, $i18next) {
            $scope.forms = FormResource.query();
            $scope.delete = function(form, index) {
                FormResource.delete(_.pick(form, '_id'));
                $scope.forms.splice(index, 1);
                //_.remove($scope.forms, form);
            };
            $scope.copy = function(form, index) {
                var newForm = FormResource.get(_.pick(form, '_id'));
                FormResource.save(_.pick(newForm, '_id'));
            };

        }
    ]);
