"use strict";
(function(){

  var app = angular.module("followmap", ['ui.bootstrap', 'ui.router', 'map.controller', 'MapService', 'DataService']);

  app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider){
    $urlRouterProvider.otherwise("/main");
    $locationProvider.html5Mode(true);
    $stateProvider
      .state('map', {
        url: "/map",
        views: {
          "mainView": {
            templateUrl: 'templates/map/map.view.html',
            controller: 'map.controller'
          }
        }
      })
  }]);

  function run($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
  };

  app.run(['$rootScope', '$state', '$stateParams', run]);
}());


