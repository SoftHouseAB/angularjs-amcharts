angular
  .module('frontend.todo')
  .controller('TodoCtrl', function ($scope, $resource, $http, $window) {
    'use strict';
      $scope.appDetails = {
        title : "Frontend",
        tagline : "Your new AngularJS app is now ready..."
      };
    $scope.todos = JSON.parse($window.localStorage.getItem('todos') || '[]');
    $scope.$watch('todos', function (newTodos, oldTodos) {
      if (newTodos !== oldTodos) {
        $window.localStorage.setItem('todos', JSON.stringify(angular.copy($scope.todos)));
      }
    }, true);

    $scope.add = function () {
      var todo = {label: $scope.label, isDone: false};
      $scope.todos.push(todo);
      $window.localStorage.setItem('todos', JSON.stringify(angular.copy($scope.todos)));
      $scope.label = '';
    };

    var fragments3 = $resource('http://localhost:8080/fragments');
    $scope.greetings = fragments3.query();
    //var helloWorld = $resource('http://localhost:8080/hello');
    //$scope.greeting = helloWorld.get();
    $http.get('http://localhost:8080/hello').then(function(response) {
      $scope.greeting = response.data;
    });


    $scope.check = function () {
      this.todo.isDone = !this.todo.isDone;
    };
  });

