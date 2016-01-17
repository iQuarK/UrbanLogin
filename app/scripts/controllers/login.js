'use strict';

/**
 * @ngdoc function
 * @name urbanApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the urbanApp
 */
angular.module('urbanApp')
  .controller('LoginCtrl', function ($scope, $location, $cookies, User) {
    $scope.error = null;
    $scope.submitted = false;

    $scope.submit = function() {
      $scope.error = null;
      $scope.submitted = false;
      console.log('submit ',arguments, $scope.email, $scope.password);
      // checks user login
      if ($scope.email && $scope.password) {
        User.checkLogin($scope.email, $scope.password)
          .then(function() {
            $location.path('/profile');
          },function(data) {
            if (data && data.error) {
              $scope.error = data.error;
            } else {
              $scope.error = 'There was an error, please try again in some minutes or contact our team.';
            }
          });
      } else {
        $scope.submitted = true;
      }
    };

  });
