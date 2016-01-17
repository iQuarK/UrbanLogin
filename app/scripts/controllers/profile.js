'use strict';

/**
 * @ngdoc function
 * @name urbanApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the urbanApp
 */
angular.module('urbanApp')
  .controller('ProfileCtrl', function ($scope, $cookies, User) {
    $scope.editProfile = false;
    $scope.error = null;

    var refresh = function() {
      User.refresh().
        then(function(data) {
          $scope.user = {
            name: data.name,
            email: data.email,
            password: data.password
          };
        }, function(data) {
          if (data && data.error) {
            $scope.error = data.error;
          }
        });
    };

    if ($cookies.get('user')) {
      $scope.user = JSON.parse($cookies.get('user'));
    } else {
      refresh();
    }

    $scope.toggleEdit = function() {
      $scope.editProfile = !$scope.editProfile;
      if (!$scope.editProfile) {
        refresh();
      }
    };

    $scope.logOut = User.logOut;
  });
