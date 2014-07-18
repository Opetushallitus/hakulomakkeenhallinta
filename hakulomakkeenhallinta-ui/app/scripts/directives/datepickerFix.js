'use strict';

app.directive('datepickerFix', ['dateFilter', 'datepickerPopupConfig', function(dateFilter, datepickerPopupConfig ) {
    // return the directive link function. (compile function not needed)
    return {
        restrict: 'EA',
        require: 'ngModel', // get a hold of NgModelController
        scope: true,
        link: function(scope, element, attrs, ngModel) {
            var format = attrs.datepickerPopup;
            var maxDate = scope[attrs.max];
            var minDate = scope[attrs.min];
            var model = ngModel;

            ngModel.$parsers.push(function(viewValue) {
                var newDate = model.$viewValue;
                var date = null;
                // pass through if we clicked date from popup
                if (typeof newDate === "object" || newDate == ""){
                    var dmsec = Date.parse(newDate),
                        d = new Date(dmsec),
                        nd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59);
                    return nd;
                }
                model.$setValidity('date', false);
                model.$setValidity('checkmonth', true);
                model.$setValidity('checkday', true);
                model.$setValidity('checkyear', true)
            // build a new date according to initial localized date format
                if (format === "dd.MM.yyyy" && newDate.length >=10) {
                    // extract day, month and year
                    var splitted = newDate.split('.');

                    var month = parseInt(splitted[1]) - 1,
                        m = parseInt(splitted[1]),
                        d = parseInt(splitted[0]);

                    if(isNaN(splitted[0]) || d >31 || d <=0 ){
                        model.$setValidity('date', false);
                        model.$setValidity('checkday', false);
                        return;
                    }else if(isNaN(splitted[1]) || m>12 || m <=0 ){
                        model.$setValidity('date', false);
                        model.$setValidity('checkmonth', false);
                        return;
                    }else if(isNaN(splitted[2])){
                        model.$setValidity('date', false);
                        model.$setValidity('checkyear', false);
                        return;
                    }else {
                        model.$setValidity('maxdate', true);
                        model.$setValidity('mindate', true);
                        date = new Date(splitted[2], month, splitted[0], 23, 59);
                        // if maxDate,minDate is set make sure we do not allow greater values
                        if (maxDate && date > maxDate){
                            model.$setValidity('maxdate', false);
                            date = new Date(maxDate);

                        }
                        if (minDate && date < minDate){
                            model.$setValidity('mindate', false);
                            date = new Date(minDate);
                        }
                        model.$setValidity('date', true);
                        model.$setViewValue(date);
                        model.$render();
                    }
                }
                date = date ? date : viewValue;
                return date;
            });

            element.on('blur', function() {
                model.$setValidity('maxdate', true);
                model.$setValidity('mindate', true);
                scope.$evalAsync(function(){
                    scope.pvmBlur();
                });


            });
        }
    };
}]);
