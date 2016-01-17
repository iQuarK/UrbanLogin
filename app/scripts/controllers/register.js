'use strict';

/**
 * @ngdoc function
 * @name urbanApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller to register a new user
 */
angular.module('urbanApp')
  .controller('RegisterCtrl', function ($scope, $location, User) {
    $scope.errorServer = null;
    $scope.patternEmail = User.patterns.email;
    $scope.submitted = false;
    $scope.email = '';
    $scope.password = '';
    $scope.fullName = '';

    $scope.submit = function() {
      $scope.errorServer = null;
      $scope.submitted = false;
      console.log('register ',arguments, $scope.email, $scope.password, $scope.fullName);

      if (User.validate($scope.email, $scope.password, $scope.fullName)) {
        // checks user login
        User.register($scope.email, $scope.password, $scope.fullName)
          .then(function() {
            $location.path('/profile');
          },
          function(data) {
            console.log('error');
            $scope.submitted = true;
            if (data.error) {
              $scope.errorServer = data.error;
            }
          });
      } else {
        $scope.submitted = true;
      }
    };

  });
