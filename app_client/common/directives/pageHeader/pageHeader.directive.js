(function() {
  'use strict';

  angular
    .module('lock8rApp')
    .directive('pageHeader', pageHeader);

  function pageHeader() {
    return {
      restrict: 'EA',
      scope: {
        content: '=content',
      },
      templateUrl: '/common/directives/pageHeader/pageHeader.template.html',
    };
  }

}());
