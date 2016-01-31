'use strict';

angular.module('incidentExtension.controllers').
  controller('incidentCtrl', function($scope, $mdSidenav, $interval, sm) {
    var ims = [];
    var refresh;
    $scope.ims = [];
    $scope.init = false;

    function handleDetailSuccess(data) {
      ims.push({'IncidentID': data.Incident.IncidentID,
        'BriefDescription': data.Incident.BriefDescription,
        'IMTicketStatus': data.Incident.IMTicketStatus,
        'OpenTime': data.Incident.OpenTime
      });
      $scope.init = true;
      $scope.ims = ims;
    }

    function handleError(errorMessage) {
      console.log('Request error: ' + errorMessage);
    }

    function handleSuccess(data) {
      if (data.content) {
        ims = [];
        if (!data || !data['@count'] || data['@count'] === 0) {
          $scope.ims = [];
          $scope.init = true;
        }
        angular.forEach(data.content, function(item) {
          sm.getResource($scope.settings).get({'id': item.Incident.IncidentID}, handleDetailSuccess, handleError);
        });
      }
    }

    function call() {
      sm.getResource($scope.settings).query(handleSuccess, handleError);
    }

    function schedule() {
      if (angular.isDefined(refresh)) {
        $interval.cancel(stop);
      }
      refresh = $interval(call, 10 * 60 * 1000);
    }

    if (localStorage.settings) {
      $scope.settings = angular.fromJson(localStorage.settings);
      $scope.conf = true;
      schedule();
      call();
    } else {
      $scope.settings = {
        url: '',
        query: '',
        auth: ''
      };
      $scope.conf = false;
    }

    $scope.openRight = function() {
      $mdSidenav('right').toggle();
    };

    $scope.close = function () {
      $mdSidenav('right').close();
    };

    $scope.saveSettings = function () {
      var settingsLocal = {
        url: $scope.settings.url,
        query: $scope.settings.query,
        user: $scope.settings.user,
        auth: 'Basic ' + window.btoa($scope.settings.user + ':' + $scope.settings.password)
      };
      $scope.settings = settingsLocal;
      localStorage.settings = angular.toJson(settingsLocal);
      $scope.conf = true;
      $scope.close();
      schedule();
      call();
    };

  })
  .filter('abs', function () {
    return function(val) {
      return Math.abs(val);
    };
  });
