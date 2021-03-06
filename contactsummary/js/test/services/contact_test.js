define([
    'common/angularMocks',
    'contact-summary/app',
    'contact-summary/mocks/services',
    'contact-summary/services/contact'
], function () {
    'use strict';

    describe('ContactService', function () {
        var ContactService,
            ModelServiceMock, ContactDetailsServiceMock, ItemServiceMock, LeaveServiceMock,
            rootScope;

        beforeEach(module('contactsummary', 'contactsummary.mocks'));

        beforeEach(module(function ($provide) {
            $provide.factory('ModelService', function () {
                return ModelServiceMock;
            });

            $provide.factory('ContactDetailsService', function () {
                return ContactDetailsServiceMock;
            });

            $provide.factory('LeaveService', function () {
                return LeaveServiceMock;
            });
        }));

        beforeEach(inject(function ($injector) {
            ModelServiceMock = $injector.get('ModelServiceMock');
            ContactDetailsServiceMock = $injector.get('ContactDetailsServiceMock');
            ItemServiceMock = $injector.get('ItemServiceMock');
            LeaveServiceMock = $injector.get('LeaveServiceMock');
            rootScope = $injector.get('$rootScope');
        }));

        beforeEach(inject(function (_ContactService_) {
            ContactService = _ContactService_;
        }));

        describe('get', function () {
            var contact, expectedDetails = {id: 123, dateOfBirth: '1970/01/01', age: 45};

            beforeEach(function () {
                ContactDetailsServiceMock.respond('get', expectedDetails);

                ContactService.get().then(function (response) {
                    contact = response;
                });

                rootScope.$digest();
            });

            it('should return contact details', function () {
                expect(contact.id).toEqual(expectedDetails.id);
                expect(contact.dateOfBirth).toEqual(expectedDetails.dateOfBirth);
                expect(contact.age).toEqual(expectedDetails.age);
            });

            it('should return contracts');

            it('should return leaves');
        });
    });
});
