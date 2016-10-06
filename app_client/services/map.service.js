'use strict';

(function () {

var app = angular.module("MapService", []);

  app.service('mapService', mapService);

  function mapService () {
    
    // Map initializing functions
    var initMap = function(origY, origX) {
      this.map = new google.maps.Map(document.getElementById('map_canvas'), {
        center: {lat: origY, lng: origX},
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM
        },
        mapTypeControl: false,
        mapTypeControlOptions: {
            position: google.maps.ControlPosition.LEFT_BOTTOM
        },
        streetViewControl: false
      });
    };

    // Retrieve the latitude and longitude points from the marker
    var getLatLng = function(marker) {
      var lat = marker.position.lat();
      var lng = marker.position.lng();
      return [lat, lng];
    };

    // Create a google maps marker
    var createMarker = function(mainMap, myLatLng){
      this.marker = new google.maps.Marker({
          position: myLatLng,
          map: mainMap,
          draggable: true
        });
    }

    // Find the directional heading of the marker
    var direction = function(direction, d){
      var path 
      // d[4] returns the non absolute value of Degrees
      if (direction == 'lat'){
        if (d[4] >= 0){
          path = 'N';
        } 
        if (d[4] < 0){
          path = 'S';
        } 
      }
      if (direction == 'lng'){
        if (d[4] >= 0){
          path = 'E';
        } 
        if (d[4] < 0){
          path = 'W';
        } 
      }
      return path
    }

    // Convert Decimal Degrees to Degrees Minutes Seconds
    var toDMS = function(dd){
      var inputNum = Math.abs(dd);
      var d = Math.abs(parseInt(inputNum));
      var m = Math.abs(parseInt((inputNum-d)*60));
      var s = Math.abs((inputNum - d - (m/60)) * 3600); 
      var sf = s.toFixed(4);
      var dms = d + "° " + m + "' " + sf + "''";
      // Absolute Value of Degrees, Minutes, Seconds fixed to 4 decmial spots
      // Non Absolute Value of Degrees for finding direction bearing
      return [d,m,sf, dms, dd];
    }

    // Return the marker's current latitude in Degrees Minutes Seconds
    var returnLat = function(mapMarker){
      return toDMS(getLatLng(mapMarker)[0]);
    }

    // Return the marker's current longitude in Degrees Minutes Seconds
    var returnLng = function(mapMarker){
      return toDMS(getLatLng(mapMarker)[1]);
    }

    // Return the marker's current latitudinal direction
    var returnLatDir = function(mapMarker){
      return direction('lat', toDMS(getLatLng(mapMarker)[0]));
    }

    // Return the marker's current longitudinal direction
    var returnLngDir = function(mapMarker){
      return direction('lng', toDMS(getLatLng(mapMarker)[1]));
    }

    // Concatonate the Coordinates for storage
    var concatonateCoordinates = function(lat, lng){
        return {'lat': lat,'lng': lng}
    }

    return {
          initMap : initMap,
          getLatLng: getLatLng,
          direction: direction,
          createMarker : createMarker,
          toDMS : toDMS,
          returnLat : returnLat,
          returnLng : returnLng,
          returnLatDir : returnLatDir,
          returnLngDir : returnLngDir,
          concatonateCoordinates: concatonateCoordinates
    };
  }

})();