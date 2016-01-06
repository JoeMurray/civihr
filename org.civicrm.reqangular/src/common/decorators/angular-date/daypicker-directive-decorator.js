define([
    'common/angular',
    'common/modules/angular-date'
], function (angular, Module) {

    Module.config(['$provide', function ($provide) {
        $provide.decorator('daypickerDirective', ['$delegate', function ($delegate) {
            $delegate[0].templateUrl = "templates/day.html";

            return $delegate;
        }]);
    }]);

});
