define(['services/services', 'lodash'], function (services, _) {
  'use strict';

  /**
   * @param {ApiService} Api
   * @param {ModelService} Model
   * @param {ContractService} Contract
   * @param $q
   * @param $log
   * @returns {ModelService|Object|*}
   * @constructor
   */
  function JobRoleService(Api, Model, Contract, $q, $log) {
    $log.debug('Service: JobRoleService');

    ////////////////////
    // Public Members //
    ////////////////////

    /**
     * @ngdoc service
     * @name JobRoleService
     */
    //var factory = Model.createInstance();
    var factory = {};

    factory.collection = {
      items: {},
      insertItem: function (key, item) {
        this.items[key] = item;
      },
      getItem: function (key) {
        return this.items[key];
      },
      set: function (collection) {
        this.items = collection;
      },
      get: function () {
        return this.items;
      }
    };

    factory.getCollection = function () {
      return this.collection.get();
    };

    /**
     * @ngdoc method
     * @name get
     * @methodOf JobRoleService
     * @returns {*}
     */
    factory.get = function () {
      /** @type {(JobRoleService|ModelService)} */
      var self = this;

      return init().then(function () {
        return self.getCollection();
      });
    };

    /////////////////////
    // Private Members //
    /////////////////////

    function init() {
      var deferred = $q.defer();

      if (_.isEmpty(factory.collection.get())) {
        Contract.get().then(function (response) {
          var contractIds = [];
          angular.forEach(response, function (contract) {
            contractIds.push(contract.id);
          });

          Api.get('HrJobRoles', {job_contract_id: {'IN': contractIds}})
            .then(function (response) {
              if (response.values.length === 0) return $q.reject('No job roles found for contracts');

              var roles = response.values.map(function (role) {
                return {id: role.id, title: role.title, department: role.department, status: role.status};
              });

              factory.collection.set(roles);
            })
            .finally(function () {
              deferred.resolve();
            });
        });
      } else {
        deferred.resolve();
      }

      return deferred.promise;
    }

    return factory;
  }

  services.factory('JobRoleService', ['ApiService', 'ModelService', 'ContractService', '$q', '$log', JobRoleService]);
});