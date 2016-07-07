(function() {
  'use strict';

  angular
    .module('lock8rApp')
    .controller('registerCtrl', registerCtrl);

  registerCtrl.$inject = ['$location', 'authentication'];
  function registerCtrl($location, authentication) {
    var vm = this;

    vm.pageHeader = {
      title: 'Create a new Lock8r account!',
    };

    vm.credentials = {
      name: '',
      email: '',
      password: '',
    };

    vm.returnPage = $location.search().page || '/';

    vm.onSubmit = function () {
      var credentials = vm.credentials;
      vm.formError = '';
      if (!credentials.name || !credentials.email || !credentials.password) {
        vm.formError = 'All fields are required. Please, try again.';
        return false;
      }

      vm.doRegister();

      return false;
    };

    vm.doRegister = function () {
      vm.formError = '';
      authentication.register(vm.credentials)
        .success(function () {
          $location.search('page', null);
          $location.path(vm.returnPage);
        })
        .error(function (err) {
          vm.formError = err;
        })
    };
  }

}());
