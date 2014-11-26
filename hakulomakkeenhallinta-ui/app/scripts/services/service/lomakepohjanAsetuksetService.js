'use strict'

angular.module('hakulomakkeenhallintaUiApp.services.service')
    .service('LomakepohjanAsetuksetService', [ '$rootScope', '$modal',
        function ($rootScope, $modal) {
            var _applicationForm = undefined;

            this.lomakepohjanAsetukset = function (applicationForm, $scope) {
                _applicationForm = applicationForm;
                $modal.open({
                    templateUrl: 'partials/dialogs/lomakepohjan-asetukset-dialog.html',
                    controller: 'lomakepohjanAsetuksetDialogCtrl',
                    size: 'lg',
                    scope: $scope,
                    resolve: {
                        applicationForm: function () {
                            return applicationForm;
                        }
                    }
                });
            };

            this.getApplicationForm = function () {
                return _applicationForm;
            }

        }]
    );