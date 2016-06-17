/**
 * Created by jaswath on 28-05-2016.
 */
angular
  .module('charts')
  .factory('Metrics', function ($http) {
    return {
      getMetrics: function(ip, sdate, edate) {
        var multiple_IP = [];
        ip.forEach(function (tempIP) {
          multiple_IP.push(tempIP.IP_AD);
        })
        //return $http.get('http://localhost:8080/metrics?ip='+multiple_IP+'&sdate='+sdate+'&edate='+edate).then(function(response) {
        return $http.get('/metrics?ip='+multiple_IP+'&sdate='+sdate+'&edate='+edate).then(function(response) {
          return JSON.parse(response.data);
        }, function (error) {
          console.log(error);
          return [];
        });
      }
    };
  })
  .factory('devicesListFactory', function ($http) {
    return {
      getDevicesList: function() {
        //return $http.get('http://localhost:8080/metrics/devices').then(function(response) {
        return $http.get('/metrics/devices').then(function(response) {
            return JSON.parse(response.data);
          });
        }
    };
  })
  .controller('AmchartCtrl', function ($scope, $rootScope, $http, $timeout, $filter, devicesList, Metrics) {
    'use strict';
    var pday = new Date();
    pday.setDate(pday.getDate() - 2);
    var CPU_USAGE = [];
    $scope.IP_ADDS = devicesList;
    $scope.loader = true;
    $scope.data = {
      sdate : {
        value : $filter('date')(pday , "yyyy-MM-dd HH:mm")
      },
      edate : {
        value : $filter('date')(Date.now(), "yyyy-MM-dd HH:mm"),
        max : $filter('date')(Date.now(), "yyyy-MM-dd")
      },
      ipads : $scope.IP_ADDS,
      selectedip : [$scope.IP_ADDS[0]]
    };

    $scope.$watch('data', function (newData, oldData) {
      if (newData != oldData) {
        $scope.loader = true;
        console.log("Wait for the chart to render...");
        if (newData.selectedip.length == 0) {
          $timeout(function() {
            $rootScope.$broadcast('amCharts.updateData', []);
          }, 500);
        }
        else {
          Metrics.getMetrics(newData.selectedip, newData.sdate.value, newData.edate.value).then(function (metrics) {
              $timeout(function () {
                $rootScope.$broadcast('amCharts.updateData', massageData(metrics, CPU_USAGE));
              }, 500);
          });
        }
      }
    }, true);

    function massageData(metrics, selectedMetric) {
      var array = [];
      metrics.forEach(function (metric) { array = array.concat(metric.metrics)})
      //var realMetrics = metrics.map(function(metric) {return metric.metrics});
      var data = {};
      array.forEach(function (m) {
        if(!data[m.DATE_AND_TIME]) {
          data[m.DATE_AND_TIME] = {}
        }
        data[m.DATE_AND_TIME]['time'] = m.DATE_AND_TIME;
        data[m.DATE_AND_TIME][m.IP_AD] = m.CPU_USAGE
      });
      var realData = Object.keys(data).map(function(key) { return data[key]});
      $scope.loader = false;
      return realData;
    }

    var graphs = [];
    $scope.IP_ADDS.forEach(function (ip) {
      graphs.push({
        type: "line",
        bullet: "round",
        title: "Server Metrics",
        valueField: ip.IP_AD,
        fillAlphas: 0
      })
    });

    $scope.amChartOptions = $timeout(function(){
      return {
        data: Metrics.getMetrics($scope.data.selectedip, $scope.data.sdate.value, $scope.data.edate.value).then(function (metrics) {
              return massageData(metrics, CPU_USAGE);
        }),
        type: "serial",
        categoryField: "time",
        rotate: false,
        legend: {
          enabled: true
        },
        chartScrollbar: {
          enabled: true
        },
        categoryAxis: {
          title: "Date",
          gridPosition: "start",
          parseDates: true,
          minPeriod: "hh"
        },
        valueAxes: [{
          position: "left",
          title: "CPU Usage"
        }],
        graphs: graphs
      }
    }, 500);
  });
