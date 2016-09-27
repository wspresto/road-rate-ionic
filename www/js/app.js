// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('unisys.onboarding',
 [
  'ionic',
  'angularMoment',
  'unisys.onboarding.controllers',
  'unisys.onboarding.constants',
  'unisys.onboarding.templates',
  'unisys.onboarding.loginUtils'
  ])

.run(['$ionicPlatform', '$rootScope', '$state', 'loginUtils', function($ionicPlatform, $rootScope, $state, loginUtils) {
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

  $rootScope.$on("$routeChangeError", function (event, current, previous, rejection) {
    if (rejection == 'NOT_AUTHORIZED') {
        $location.path('/login');
    } else {
      $state.go($state.current.name);
    }
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
    },
    resolve: {
      userAuthenticated: ["$http", "$q", function ($http, $q) {
        var deferred = $q.defer();
            if(firebase.auth().currentUser) {
                deferred.resolve();
            } else {
                deferred.reject('NOT_AUTHORIZED');
            }
            return deferred.promise;
        }]
    }
  })
  .state('app.road', {
    url: '/road',
    views: {
      'content@app': {
        controller: 'RoadCtrl as vm',
        templateUrl: 'road/road.html'
      }
    },
    resolve: {
      userAuthenticated: ["$http", "$q", function ($http, $q) {
        var deferred = $q.defer();
            if(firebase.auth().currentUser) {
                deferred.resolve();
            } else {
                deferred.reject('NOT_AUTHORIZED');
            }
            return deferred.promise;
        }]
    }
  })  
  .state('app.landing', {
    url: '/landing',
    views: {
      'content@app': {
        controller: 'LandingCtrl as vm',
        templateUrl: 'landing/landing.html'
      }
    },
    resolve: {
      userAuthenticated: ["$http", "$q", function ($http, $q) {
        var deferred = $q.defer();
            if(firebase.auth().currentUser) {
                deferred.resolve();
            } else {
                deferred.reject('NOT_AUTHORIZED');
            }
            return deferred.promise;
        }]
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