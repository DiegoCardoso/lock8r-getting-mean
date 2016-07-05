(function(angular) {
  'use strict';

  angular
    .module('lock8rApp')
    .directive('ratingStars', ratingStars);

  function ratingStars() {
    return {
      restrict: 'EA',
      scope: {
        thisRating: '=rating',
      },
      templateUrl: '/common/directives/ratingStars/ratingStars.template.html',
    }
  }

}(angular));
