define([
    'common/angular',
    'common/modules/angular-date'
], function (angular, Module) {

    Module.directive('customDateInput', ['$filter', function ($filter) {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ngModelController) {

                function convert(data) {
                    var output = $filter('CustomDate')(data);

                    output = (output == 'Unspecified') ? '' : output;

                    return output;
                }

                ngModelController.$formatters.push(convert);
            }
        };
    }]);

});