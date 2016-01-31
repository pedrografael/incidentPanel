'use strict';

angular.module('incidentExtension', ['incidentExtension.controllers', 'ngResource', 'ngAnimate', 'ngAria', 'ngMaterial', 'md.data.table', 'angularMoment']).
  service('sm', ['$resource', function($resource) {
    return {
      getResource: function(settings) {
        return $resource(
          settings.url + '/incidents/:id',
          {},
          {
            query: {
              method: 'GET',
              headers: {
                Authorization: settings.auth
              },
              params: {
                query: settings.query
              },
              timeout: 10000
            },
            get: {
              method: 'GET',
              headers: {
                Authorization: settings.auth
              },
              timeout: 10000
            }
          }
        );
      }
    };
  }]);

angular.module('incidentExtension.controllers', []);
