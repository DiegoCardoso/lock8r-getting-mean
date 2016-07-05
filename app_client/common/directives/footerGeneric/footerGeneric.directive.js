(function(angular) {
  'use strict';

  angular
    .module('lock8rApp')
    .directive('footerGeneric', footerGeneric);

  function footerGeneric() {
    return {
      restrict: 'EA',
      templateUrl: '/common/directives/footerGeneric/footerGeneric.template.html',
    };
  }

}(angular));
