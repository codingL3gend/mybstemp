﻿'use strict';

angular.module('mbs.services', ['ngRoute', 'ngResource'])
	   .factory('MbsAPI',
			   function ($resource) {
			       return $resource('http://192.168.1.65\\:8080/my.barber.shop.api/:call/:values', { call: '', values: '' },
                    {
                        //		   								query: {method: 'GET', params:{phoneId: 'phones'}, isArray:true},
                        checkUsername: { method: 'GET' },
                        createUser: { method: 'GET' },
                        deleteUser: { method: 'GET' },
                        loginUser: { method: 'GET' },
                        updatePasswordQuestion: { method: 'GET' },
                        forgotPassword: { method: 'GET' },
                        resetPassword: { method: 'GET' },

                        getBarberShops: { method: 'GET' },
                        createBarberShop: { method: 'GET' },
                        getBarberShopDetails: { method: 'GET' },
                        getNearbyBarberShops: { method: 'GET' },
                                        
                        createBarberShopCustomer: { method: 'GET' },

                        getBarberAppointments: { method: 'GET' },
                        getCustomerAppointments: { method: 'GET' },
                        createAppointment: { method: 'GET' },
                        deleteAppointment: { method: 'GET' },

                        updateUser: { method: 'GET' },

                        getUserProfile: { method: 'GET' },
                        getBaberProfile: { method: 'GET' },
                        updateBarberInfo: { method: 'GET' },
                                        
                        createBarberSchedule: { method: 'GET' },
                        updateBarberSchedule: { method: 'GET' },
                                        
                        getSpecialties: { method: 'GET' },
                        createBarberSpecialties: { method: 'GET' },
                                        
                        createBarberRating: { method: 'GET' },
                        updateBarberRating: { method: 'GET' },

                        getUserImages: { method: 'GET' },
                        getUserVideos: { method: 'GET' },

                        uploadImage: { method: 'POST' }
                    });
			   })
      .factory('PlacesAPI',
			   function ($resource) {
			       return $resource('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {},
                                    {
                                        getBarberShops: { method: 'GET' }
                                    });
			   })
      .factory('geolocation', function($rootScope, cordovaReady)
      {
          return {
              getCurrentPosition: cordovaReady(function(onSuccess, onError, options)
              {
                  navigator.geolocation.getCurrentPosition(function () {
                      var that = this,
                        args = arguments;

                      if (onSuccess) {
                          $rootScope.$apply(function () {
                              onSuccess.apply(that, args);
                          });
                      }
                  }, function () {
                      var that = this,
                        args = arguments;

                      if (onError) {
                          $rootScope.$apply(function () {
                              onError.apply(that, args);
                          });
                      }
                  },
                  options);
              })
          };
      })
    //.factory('cordovaReady', function() {
    //    return function (fn) {

    //        var queue = [];

    //        var impl = function () {
    //            queue.push(Array.prototype.slice.call(arguments));
    //        };

    //        document.addEventListener('deviceready', function () {
    //            queue.forEach(function (args) {
    //                fn.apply(this, args);
    //            });
    //            impl = fn;
    //        }, false);

    //        return function () {
    //            return impl.apply(this, arguments);
    //        };
    //    };
//})
    .factory("cordova", ['$q', "$window", "$timeout", function ($q, $window, $timeout) {
        var deferred = $q.defer();
        var resolved = false;

        document.addEventListener('deviceready', function () {
            resolved = true;
            deferred.resolve($window.cordova);
        }, false);

        $timeout(function () {
            if (!resolved && $window.cordova) {
                deferred.resolve($window.cordova);
            }
        });

        return { ready: deferred.promise };
    }])
    .factory("adapterSvc", ['$q', function ($q) {
        return {
            toAngularPromise: function (winjsPromise) {
                var deferred = $q.defer();

                winjsPromise.then(function (value) {
                    deferred.resolve(value);
                }, function (err) {
                    deferred.reject(err);
                }, function (value) {
                    deferred.notify(value);
                });

                return deferred.promise;
            },

            toWinJSPromise: function (angularPromise) {
                var signal = new WinJS._Signal();

                angularPromise.then(function (value) {
                    signal.complete(value);
                }, function (err) {
                    signal.error(err);
                }, function (value) {
                    signal.progress(value);
                });

                return signal.promise;
            }
        }
    }]);
    
