define([
    'common/angular',
    'common/modules/angular-date',
    'common/services/angular-date/date-factory'
], function (angular, Module) {
    Module.filter('CustomDate', ['$filter', 'DateFactory', function ($filter, DateFactory) {
        return function (datetime) {
            var Date;

            if (typeof datetime == 'object') {
                datetime = $filter('date')(datetime, 'dd/MM/yyyy');
            }

            Date = DateFactory.createDate(datetime, [
                'DD-MM-YYYY',
                'DD-MM-YYYY HH:mm:ss',
                'YYYY-MM-DD',
                'YYYY-MM-DD HH:mm:ss',
                'DD/MM/YYYY',
                'x'
            ], true);

            var beginningOfEra = DateFactory.createDate('01/01/1970');
            var isHighEnough = !Date.isSame(beginningOfEra);

            if (Date.isValid() && isHighEnough) return Date.format('DD/MM/YYYY');

            return 'Unspecified';
        };
    }]);
});