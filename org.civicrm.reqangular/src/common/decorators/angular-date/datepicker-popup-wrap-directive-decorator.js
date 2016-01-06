define([
    'common/angular',
    'common/modules/angular-date'
], function (angular, Module) {

    Module.config(['$provide', function ($provide) {

        $provide.decorator('datepickerPopupWrapDirective', ['$delegate', function ($delegate) {

            $delegate[0].templateUrl = 'templates/datepickerPopup.html';

            return $delegate;
        }]);
    }]);
});