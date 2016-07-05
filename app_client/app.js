(function(angular) {
  'use strict';
  angular.module('lock8rApp', ['ngRoute', 'ngSanitize']);

  function configRouting($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'home/home.view.html',
        controller: 'homeCtrl',
        controllerAs: 'vm',
      })
      .when('/about', {
        templateUrl: '/common/views/genericText.view.html',
        controller: 'aboutCtrl',
        controllerAs: 'vm',
      })
      .otherwise({
        redirectTo: '/',
      });

      $locationProvider.html5Mode(true);
  }

  angular
    .module('lock8rApp')
    .config(['$routeProvider', '$locationProvider', configRouting]);

}(angular));
