
/// <reference path="../scripts/angular-winjs.js" />

'use strict';

var mbsAapp = angular.module('mbs', ['mbs.services', 'mbs.controllers', 'ngRoute', 'ui.router', 'ngAnimate', 'winjs', 'ngTouch', 'mobile-angular-ui', 'mobile-angular-ui.scrollable', 'mobile-angular-ui.directives.toggle', 'mobile-angular-ui.directives.overlay', 'ui.bootstrap', 'ngSanitize',]) //'mobile-angular-ui.touch',
;

mbsAapp.config(function ($stateProvider) {
    $stateProvider
     .state('home', {
         url: '/',
         templateUrl: './pages/login/login.html',
         controller: 'authController',
     })
    .state('index', {
        url: '/home',
        templateUrl: './pages/home/home.html',
        controller: 'siteController',
    })
    .state('barberShop', {
        url: '/barbershop/:barberShopID',
        templateUrl: './pages/barbershop/barbershop.html',
        controller: 'barberShopController',
    });
});

mbsAapp.run(function (navigationSvc) {
    navigationSvc.goHome();
});

mbsAapp.animation('.turnstile-animation', function () {
    return {
        enter: function (element, done) {
            WinJS.UI.Animation.turnstileForwardIn(element[0]).then(done);
        },
        leave: function (element, done) {
            done();
        }
    };
});

mbsAapp.constant('homeStateName', 'barberShop');

(function () {
    var NavigationSvc = function ($q, $state, adapterSvc, homeStateName) {
        WinJS.Navigation.addEventListener('navigating', function (args) {
            var targetState = args.detail.location;
            var angularPromise = $state.go(targetState, args.detail.state);

            args.detail.setPromise(adapterSvc.toWinJSPromise(angularPromise));
        });

        this.goHome = function () {
            return adapterSvc.toAngularPromise(WinJS.Navigation.navigate(homeStateName));
        };

        this.navigateTo = function (view, initialState) {
            return adapterSvc.toAngularPromise(WinJS.Navigation.navigate(view, initialState));
        };

        this.goBack = function () {
            return adapterSvc.toAngularPromise(WinJS.Navigation.back());
        };

        this.goForward = function () {
            return adapterSvc.toAngularPromise(WinJS.Navigation.forward());
        };
    };

    mbsAapp.service('navigationSvc', NavigationSvc);
}());
