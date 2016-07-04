(function(angular) {
  'use strict';
  angular.module('lock8rApp', ['ngRoute']);

  function configRouting($routeProvider) {
    $routeProvider
      .when('/', {

      })
      .otherwise({
        redirectTo: '/',
      });
  }

  angular
    .module('lock8rApp')
    .config(['$routeProvider', configRouting]);

}(angular));
