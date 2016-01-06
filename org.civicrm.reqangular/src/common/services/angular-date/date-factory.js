define([
    'common/angular',
    'common/modules/angular-date',
    'common/moment'
], function (angular, Module, moment) {
    'use strict';

    Module.factory('DateFactory', function () {
        return {
            moment: moment,
            /**
             * Wrapper for moment()
             * @param dateString
             * @param format
             * @param strict
             * @returns Moment Object
             */
            createDate: function createDate(dateString, format, strict) {
                return this.moment.apply(null, arguments);
            }
        };
    });

});