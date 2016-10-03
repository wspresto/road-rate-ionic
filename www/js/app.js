// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('unisys.onboarding',
 [
  'ionic',
  'ngCordova',
  'angularMoment',
  'esri.map',
  'esri.core',
  'unisys.onboarding.controllers',
  'unisys.onboarding.constants',
  'unisys.onboarding.templates',
  'unisys.onboarding.firebase.service',
  'unisys.onboarding.directives',
  'unisys.onboarding.services'
  ])

.run(['$q', '$ionicPlatform', '$rootScope', '$state', 'loginUtils', 'esriService', function($q, $ionicPlatform, $rootScope, $state, loginUtils, esriService) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });    

  esriService.loadModule('esri/config').then(function (esriConfig) {
    esriConfig.defaults.geometryService = "http://www.example.com/arcgis/rest/services/Utilities/Geometry/GeometryServer";
  });

  $rootScope.$on('$stateChangeSuccess', function() {
    firebase.auth().onAuthStateChanged(function (user) {
      if (!user) {
          $state.go('app.login');
          
      } else if (user && $state.current.name !== 'app.login') {
        $state.go($state.current.name);
      } else {
        $state.go('app.landing');
      }
      firebaseService.setUser(user);
    });
  });

}])
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  
  $stateProvider
  .state('app', {
    url: '/road-rate',
    abstract: true, 
    views: {
      '': {
        controller: 'MenuCtrl as vm',
        templateUrl: 'menu/menu.html'
      }
    }
  })
  .state('app.road', {
    url: '/road',
    views: {
      'content@app': {
        controller: 'RoadCtrl as vm',
        templateUrl: 'map/map.html'
      }
    }
  })  
  .state('app.landing', {
    url: '/landing',
    views: {
      'content@app': {
        controller: 'LandingCtrl as vm',
        templateUrl: 'landing/landing.html'
      }
    }
  })
  .state('app.login', {
    url: '/login',
    views: {
      'content@app': {
        controller: 'LoginCtrl as vm',
        templateUrl: 'login/login.html'
      }
    }
  });

  $urlRouterProvider.otherwise('/road-rate/landing');

}]);
