define([
    'common/angular',
    'common/modules/angular-date'
], function (angular, Module) {

    Module.config(['$provide', function ($provide) {

        $provide.decorator('datepickerDirective', ['$delegate', function ($delegate) {
            var old_link = $delegate[0].link;

            $delegate[0].compile = function () {
                return function (scope, element, attrs, ctrls) {

                    /**
                     * @override
                     * @type {number}
                     */
                    ctrls[0].startingDay = 1;

                    old_link.apply(this, arguments);
                };
            };

            return $delegate;
        }]);
    }]);
});

