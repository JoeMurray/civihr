define([
    'common/angular',
    'common/angularBootstrap',
    'common/modules/angular-date/templates-main'
], function (angular) {
    'use strict';

    return angular.module('common.angular-date', ['templates-main', 'ui.bootstrap']);
});
