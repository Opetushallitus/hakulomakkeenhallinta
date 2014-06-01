'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('FormtemplatesCtrl', ['$scope', '_', 'FormResource', '$i18next', 'Mallipohjat',
        function($scope, _, FormResource, $i18next, Mallipohjat) {
            console.log('********** FormtemplatesCtrl');
//            $scope.forms = Mallipohjat.query();

            $scope.delete = function(form, index) {
//                FormResource.delete(_.pick(form, '_id'));
                console.log(form._id);
                Mallipohjat.delete({_id: form._id},
                    function success(resp){
                        console.log(resp);
                        $scope.forms.splice(index, 1);
                        //_.remove($scope.forms, form);
                    },function error(error){
                        //TODO: tämän käsittely
                        console.log(error);
                    });

            };
            $scope.copy = function(form, index) {
                var newForm = FormResource.get(_.pick(form, '_id'));
                FormResource.save(_.pick(newForm, '_id'));
            };

        }
    ]);
