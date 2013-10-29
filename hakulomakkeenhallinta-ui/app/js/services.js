'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var services = angular.module('myApp.services', []).
  value('version', '0.1');

services.service('dialogService', ['$modal', '$log', '$rootScope', function ($modal, $log, $rootScope) {

    var dialogDefaults = {
        templateUrl: 'partials/common/dialog.html',
        controller: "DialogServiceController",
        backdrop: true, // true, "static", false
        keyboard: true  // closable with ESC?
    };

    var dialogTextDefaults = {
        title: "Really?",
        description: "<i>Really</i> do <b>that</b>?",
        ok: "YEAS please!",
        cancel: "Naaaah..."
    };

    /**
     * Returns ($modal) dialog instance which can then be used to wait for user interaction: dialogInstance.result.then(...
     *
     * customDialogTextDefaults:
     * <ul>
     *   <li>title: "foobar"</li>
     *   <li>description: "foobar <b>text</b>"</li>
     *   <li>ok: "Proceed"</li>
     *   <li>cancel: "abort"</li>
     * </ul>
     *
     * customDialogDefaults:
     * <ul>
     *   <li>backdrop: true, 'static', false</li>
     *   <li>keyboard: true / false</li>
     *   <li>templateUrl: 'MyController'</li>
     *   <li>templateUrl: 'MyTemplate.html'</li>
     * </ul>
     *
     * @param Object customDialogTextDefaults
     * @param {type} customDialogDefaults
     * @returns {@exp;$modal@call;open}
     */
    this.showDialog = function (customDialogTextDefaults, customDialogDefaults) {
        var tempDialogDefaults = {};
        angular.extend(tempDialogDefaults, dialogDefaults, customDialogDefaults);

        var tempDialogTextDefaults = {};
        angular.extend(tempDialogTextDefaults, dialogTextDefaults, customDialogTextDefaults);

        if (!tempDialogDefaults.scope) {
            tempDialogDefaults.scope = $rootScope.$new();
        }
        if (!tempDialogDefaults.scope.dialog) {
            tempDialogDefaults.scope.dialog = tempDialogTextDefaults;
        }

        $log.info("showDialog(): ", tempDialogTextDefaults, tempDialogDefaults);

        return $modal.open(tempDialogDefaults);
    };


    this.showNotImplementedDialog = function () {
        var texts = {
            title: "title",
            description: "description",
            ok: "ok",
            cancel: "cancel"
        };

        return this.showDialog(texts);
    };


}]);

/**
 * Simple default controller for the "partials/common/dialog.html" template.
 * Closes dialog with result of "ACTION" or "CANCEL".
 *
 * @param {type} param1
 * @param {type} param2
 */
services.controller('DialogServiceController', ['$scope', '$log', '$modalInstance',
    function ($scope, $log, $modalInstance) {

        $log.info("dialogServiceController()");

        $scope.onAction = function () {
            $log.info("onAction()", $modalInstance);
            $modalInstance.close("ACTION");
        };

        $scope.onClose = function () {
            $log.info("onClose()", $modalInstance);
            $modalInstance.close("CANCEL");
        };

    }]);
