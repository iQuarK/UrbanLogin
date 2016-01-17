'use strict';

/**
 * @ngdoc overview
 * @name urbanApp
 * @description
 * # urbanApp
 *
 * Main module of the application.
 */
angular
  .module('urbanApp', [
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl',
        controllerAs: 'register'
      })
      .when('/profile', {
        templateUrl: 'views/profile/show.html',
        controller: 'ProfileCtrl',
        controllerAs: 'profile'
      })
      .otherwise({
        redirectTo: '/login'
      });
  })
  .run(function($rootScope, $cookies, $location) {

    // checks changes of routes to redirect the user to login page if no signed in or
    // to profile page if signed in
    $rootScope.$on('$routeChangeSuccess', function(e, data) {
      var cookie = $cookies.get('user');
      var regEx = /(login|register)/;

      // logged in
      if (cookie) {
        if (data.$$route && data.$$route.originalPath) {

          if (regEx.test(data.$$route.originalPath)) {
            $location.path('/profile');
          }
        }
      } else {
        // no logged in 
        if (!data.$$route || !regEx.test(data.$$route.originalPath)) {
          $location.path('/login');
        }
      }

    });
      
  });
