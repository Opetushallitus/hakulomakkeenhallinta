'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('FormtemplatesCtrl', ['$scope', '$rootScope', '_', 'FormResource', '$i18next', 'Mallipohjat',
        function($scope, $rootScope, _, FormResource, $i18next, Mallipohjat) {
            $rootScope.LOGS('FormtemplatesCtrl',6 );
//            $scope.forms = Mallipohjat.query();

            $scope.delete = function(form, index) {
//                FormResource.delete(_.pick(form, '_id'));
                console.log(form._id);
                Mallipohjat.delete({_id: form._id},
                    function success(resp){
                        $rootScope.LOGS('Formtemplates',14,resp);
                        $scope.forms.splice(index, 1);
                        //_.remove($scope.forms, form);
                    },function error(error){
                        //TODO: tämän käsittely
                        $rootScope.LOGS('Formtemplates',19,error);
                    });

            };
            $scope.copy = function(form, index) {
                var newForm = FormResource.get(_.pick(form, '_id'));
                FormResource.save(_.pick(newForm, '_id'));
            };

        }
    ]);
