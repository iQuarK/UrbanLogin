'use strict';

/**
 * @ngdoc function
 * @name urbanApp.service:User
 * @description
 * # User
 * Services that connects to the server to retrieve the data of the user
 */
angular.module('urbanApp')
  .factory('User', function ($http, $q, $cookies, $location) {
    var URI = 'http://localhost:3000/';
    var that = this;
    var patterns = {
      email: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/
    };
    // retrieve the data from the server
    that.user = null;

    // Refreshes the data of a user for the current session
    var refresh = function() {
      var defer = $q.defer();

      if (that.user && that.user.id) {
        $http.get(URI+'user/'+that.user.id)
          .success(function(data) {
            that.user = data;
            $cookies.put('user', JSON.stringify(data));
            defer.resolve(data);
          })
          .error(function(data) {
            defer.reject(data);
          });
      } else {
        defer.reject({
          error: 'User does not exists.'
        });
      }

      return defer.promise;
    };

    // Checks the user login for a given data
    var checkLogin = function(email, password) {
      var defer = $q.defer();

      $http.post(URI+'login', {email: email, password: password})
        .success(function(data) {
          that.user = data;
          $cookies.put('user', JSON.stringify(data));
          console.log('user:', JSON.parse($cookies.get('user')));
          defer.resolve();
        })
        .error(function(data) {
          defer.reject(data);
        });

      return defer.promise;
    };

    // Method to register a user
    var register = function(email, password, name) {
      var defer = $q.defer();

      $http.post(URI+'register', {email: email, password: password, name: name})
        .success(function(data) {
          that.user = data;
          $cookies.put('user', JSON.stringify(data));
          defer.resolve();
        })
        .error(function(data) {
          defer.reject(data);
        });

      return defer.promise;
    };

    // Method to edit a user
    var edit = function(id, email, password, name) {
      var defer = $q.defer();

      $http.post(URI+'user/'+id+'/edit', {email: email, password: password, name: name})
        .success(function(data) {
          that.user = data;
          defer.resolve();
        })
        .error(function(data) {
          defer.reject(data);
        });

      return defer.promise;
    };

    // Validates the related fields to a user
    var validate = function(email, password, name) {
      var valid = true;

      if (!email || email.trim() === '' || !patterns.email.test(email)) {
        valid = false;
      } else {
        if (!password || password.trim() === '') {
          valid = false;
        } else {
          if (!name || name.trim() === '') {
            valid = false;
          }
        }
      }

      return valid;
    };

    // Closes a session
    var logOut = function() {
      $cookies.remove('user');
      $location.path('/login');
    };

    return {
      data: that.user,
      checkLogin: checkLogin,
      register: register,
      refresh: refresh,
      patterns: patterns,
      validate: validate,
      edit: edit,
      logOut: logOut
    };
  });
