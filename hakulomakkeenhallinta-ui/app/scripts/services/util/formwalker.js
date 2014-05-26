'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.util', [])
  .service('FormWalker', [ '_', function(_) {

        var walker = _.walk(function(e) {
            return e.children;
        });

        this.find = function(root, predicate) {
            return walker.find(root, predicate);
        };

        this.filter = function(root, predicate) {
            return walker.filter(root, _.walk.preorder, predicate);
        };

        this.filterByType = function(root, type) {
            return this.filter(root, function(el) {
                return el._class && el._class.indexOf(type) != -1;
            });
        };

        this.filterByTheme = function(root, theme) {
            return this.filter(root, function(el) {
                return el._id && el._id.indexOf(theme) != -1;
            });
        };
    }
  ]);
