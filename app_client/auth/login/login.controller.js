(function() {
  'use strict';

  angular.module('lock8rApp')
    .controller('loginCtrl', loginCtrl);

  loginCtrl.$inject = ['$location', 'authentication'];

  function loginCtrl($location, authentication) {
    var vm = this;

    vm.pageHeader = {
      title: 'Sign in to Lock8r',
    };

    vm.credentials = {
      email: '',
      password: '',
    };

    vm.returnPage = $location.search().page || '/';

    vm.onSubmit = function () {
      vm.formError = '';
      var credentials = vm.credentials;

      if (!credentials.email || !credentials.password) {
        vm.formError = 'All fields are required. Please, try again.';
        return false;
      }
      vm.doLogin();
    };

    vm.doLogin = function () {
      vm.formError = '';

      authentication.login(vm.credentials)
        .success(function () {
          $location.search('page', null);
          $location.path(vm.returnPage);
        })
        .error(function (err) {
          vm.formError = err;
        });
    }
  }


}());
