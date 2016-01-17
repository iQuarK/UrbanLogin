'use strict';

/**
 * @ngdoc function
 * @name urbanApp.directive:editProfile
 * @description
 * # editProfile
 * Directive that shows the form to edit the profile
 */
angular.module('urbanApp')
  .directive('editProfile', function (User) {

    var link = function (scope) {
      scope.submitted = false;
      scope.patternEmail = User.patterns.email;
      scope.id = -1;
      scope.name = '';

      User.refresh().then(
        function(data) {
          scope.email = data.email;
          scope.password = data.password;
          scope.name = data.name;
          scope.id = data.id;
        });

      scope.error = null;
      scope.submit = function() {
        scope.error = null;
        scope.submitted = false;

        if (User.validate(scope.email, scope.password, scope.name)) {
          // checks user login
          User.edit(scope.id, scope.email, scope.password, scope.name)
            .then(function() {
              scope.toggleEdit();
            },
            function(data) {
              console.log('error');
              scope.submitted = true;
              if (data.error) {
                scope.error = data.error;
              }
            });
        } else {
          scope.submitted = true;
        }
      };

    };

    return {
      templateUrl: 'views/profile/edit.html',
      scope: {
        toggleEdit: '&'
      },
      link: link
    };
  });