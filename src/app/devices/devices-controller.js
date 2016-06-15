/**
 * Created by jaswath on 15-06-2016.
 */

angular
  .module('device')
  .factory('metricsListFactory', function ($http) {
    return {
      getMetricsList: function() {
        return $http.get('http://localhost:8080/metrics').then(function(response) {
          return JSON.parse(response.data);
        });
      }
    };
  })
  .controller('DeviceCtrl', function ($scope, $route, $http, metricsList) {
    'use strict';
    $scope.metricsData = metricsList;
    $scope.itemsPerPage = 10;
    $scope.totalPages = $scope.metricsData.length/$scope.itemsPerPage + 1;

    $scope.removeDevice = function (metric) {
      if(window.confirm("Are you sure? \nWARNING: Device will be deleted permanently!")) {
        $http.get('http://localhost:8080/metrics/delete?ip='+metric.IP_AD).then(function (response) {
          console.log(response);
          window.location.reload();
        })
      }
    };

    $scope.removeItem = function (metric) {
      if(window.confirm("Are you sure? \nWARNING: Data will be deleted permanently!")) {
        var index = $scope.metricsData.indexOf(metric);
        if (index !== -1) {
          $scope.metricsData.splice(index, 1);
        }
        $http.get('http://localhost:8080/metrics/delete?ip='+metric.IP_AD+'&date='+metric.DATE_AND_TIME).then(function (response) {
          console.log(response);
        })
      }
    };
  });
