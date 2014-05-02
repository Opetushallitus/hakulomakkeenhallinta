'use strict';

angular.module('services.service')
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
    }
  ]);
