'use strict';

(function() {

  var app = angular.module("DataService", []);

  app.factory('dataService', dataService);

    function dataService ($http) {
    // ------------------ LOCAL SERVICES -------------------

    // Stores an object to a holder in the users Local Storage
    var storeToLocal = function(holder, object){
      localStorage.setItem(holder, JSON.stringify(object));
    }

    // Retrieves local object
    var retrieveLocal = function(object){
      var retrievedObject = localStorage.getItem(object);
      // If retrieving from local coordinates and havent yet selected coordinates
      // Return the origin coordinates
      if (object === 'coordinates' && retrievedObject === null){
        return JSON.parse('{"lat\":\"N 38° 26\' 1.3488\'\'\",\"lng\":\"W 78° 53\' 54.7332\'\'\"}')
      }
      return JSON.parse(retrievedObject)
    }

    return {
      storeToLocal : storeToLocal,
      retrieveLocal  : retrieveLocal
    };
  }


})();