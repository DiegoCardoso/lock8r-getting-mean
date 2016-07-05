(function(angular) {
  'use strict';
  angular.module('lock8rApp', ['ngRoute']);

  function configRouting($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'home/home.view.html',
        controller: 'homeCtrl',
        controllerAs: 'vm',
      })
      .otherwise({
        redirectTo: '/',
      });
  }

  angular
    .module('lock8rApp')
    .config(['$routeProvider', configRouting]);

}(angular));
