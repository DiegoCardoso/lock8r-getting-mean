(function(angular) {
  'use strict';

  angular
    .module('lock8rApp')
    .filter('addHtmlLineBreaks', addHtmlLineBreaks);

  function addHtmlLineBreaks() {
    return function (text) {
      return text.replace(/\n/g, '<br />');
    }
  }

}(angular));
