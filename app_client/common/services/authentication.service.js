(function() {
  'use strict';

  angular
    .module('lock8rApp')
    .service('authentication', authentication);

  authentication.$inject = ['$window', '$http']
  function authentication ($window, $http) {
    var localStorageEntry = 'lock8r-token';

    var saveToken = function (token) {
      $window.localStorage[localStorageEntry] = token;
    };

    var getToken = function () {
      return $window.localStorage[localStorageEntry];
    };

    var register = function (user) {
      return $http.post('/api/register', user)
        .success(function (data) {
          saveToken(data.token);
        });
    };

    var login = function (user) {
      return $http.post('/api/login', user)
        .success(function (data) {
          saveToken(data.token);
        });
    };

    var logout = function () {
      $window.localStorage.removeItem(localStorageEntry);
    };

    var getPayloadFromToken = function (token) {
      return JSON.parse($window.atob(token.split('.')[1]));
    };

    var isLoggedIn = function () {
      var token = getToken();

      if (!token) {
        return false;
      }

      var payload = getPayloadFromToken(token);
      return payload.exp > (Date.now() / 1000);
    };

    var currentUser = function () {
      if (isLoggedIn()) {
        var payload = getPayloadFromToken(getToken());

        return {
          email: payload.email,
          name: payload.name,
        };
      }
    };

    return {
      saveToken: saveToken,
      getToken: getToken,
      register: register,
      login: login,
      logout: logout,
      currentUser: currentUser,
      isLoggedIn: isLoggedIn,
    };
  }

}());
