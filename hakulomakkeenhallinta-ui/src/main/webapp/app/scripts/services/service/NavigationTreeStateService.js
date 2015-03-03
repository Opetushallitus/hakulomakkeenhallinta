"use strict";

angular.module('hakulomakkeenhallintaUiApp.services.service')
    .service('NavigationTreeStateService', [ '$rootScope',
        function () {

            var nodeState = {};

            this.showNode = function (nodeId) {
                if(nodeState[nodeId]) {
                    return true;
                }
                return false;
            };

            this.toggleNodeState = function (nodeId) {
                nodeState[nodeId] = !this.showNode(nodeId);
            };

            this.setNodeState = function (nodeId, value) {
                nodeState[nodeId] = value == true;
            };

        }
    ]);