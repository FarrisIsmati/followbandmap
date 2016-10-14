'use strict';

(function() {

var app = angular.module("map.controller", []);

app.controller('map.controller', function($scope, $location, mapService, dataService){
  var mapService = mapService;
  var dataService = dataService;

  $scope.previewBox = false;

  $scope.exportImage = function(){
    if($scope.previewBox){
      $scope.previewBox = false;
    } else{
      $scope.previewBox = true;
    }
  }
  

  // Check if google maps api loaded successfully
  if (typeof google === 'object' && typeof google.maps === 'object') {

    // If there are saved coordinates in local storage use it
    // If not use the default position
    var decimalDegrees = dataService.retrieveLocal('decimalDegrees');

    if (decimalDegrees != null){
      var origY = decimalDegrees[0];
      var origX = decimalDegrees[1];
    } else {
      var origY = 38.433708;
      var origX = -78.898537;
    }

    // Declare new map
  	var map = new mapService.initMap(origY, origX);

    console.log('Google maps loaded!');

    // Set the maps constructor coordinates
    var myLatLng = new google.maps.LatLng(origY, origX);

    // Create a map marker referencing the map
    var mapMarker = new mapService.createMarker(map.map, myLatLng);

    var saveDecimalDegreesToStorage = function(){
      var latLngDecimalDegrees = [mapService.returnLat(mapMarker.marker)[4], mapService.returnLng(mapMarker.marker)[4]]

      localStorage.setItem('decimalDegrees', JSON.stringify(latLngDecimalDegrees));
    }

    $scope.latitudeDirection =  mapService.returnLatDir(mapMarker.marker);
    $scope.latitudeDMS = mapService.returnLat(mapMarker.marker)[3];
    $scope.latitude = mapService.returnLat(mapMarker.marker);
    $scope.longitude = mapService.returnLng(mapMarker.marker);
    $scope.longitudeDirection = mapService.returnLngDir(mapMarker.marker);
    $scope.longitudeDMS = mapService.returnLng(mapMarker.marker)[3];

    $scope.$watch('latitude', function(newValue, oldValue, scope){
      if (parseFloat(newValue[2]) > 9.9999){
         $scope.latsec = true;
         console.log('run double');
      } else {
        $scope.latsec = false;
        console.log('run single');
      }
      if (parseFloat(newValue[1]) > 9.9999){
         $scope.latmin = true;
      } else {
        $scope.latmin = false;
      }
      if (parseFloat(newValue[0]) > 9){
         $scope.lathour = true;
      } else {
        $scope.lathour = false;
      }
    });

    $scope.$watch('latitudeDirection', function(newValue, oldValue, scope){
      if (newValue.toLowerCase() === 'n'){
        $scope.latdirection = true;
      } else {
        $scope.latdirection = false;
      }
    });

    console.log($scope.longitude);
    $scope.$watch('longitudeDirection', function(newValue, oldValue, scope){
      if (newValue.toLowerCase() === 'w'){
        $scope.lngdirection = true;
        $scope.lngDir = 'W';
      } else {
        $scope.lngdirection = false;
        $scope.lngDir = 'e';
      }
    });

    $scope.$watch('longitude', function(newValue, oldValue, scope){
      console.log(newValue);
      if (parseFloat(newValue[2]) > 9.9999){
         $scope.lngsec = true;
      } else {
        $scope.lngsec = false;
      }
      $scope.appliedClassMinutes = function() {
          if (parseFloat(newValue[1]) > 9 && parseFloat(newValue[0]) > 99) {
            return ["preview_minutes_double_triple", "preview_line_min_triple"];
          } if (parseFloat(newValue[1]) > 9 && parseFloat(newValue[0]) < 100) {
            return ["preview_minutes_double", "preview_line_min_double"];
          } if (parseFloat(newValue[1]) < 10 && parseFloat(newValue[0]) > 99) {
            return ["preview_minutes_single_triple", "preview_line_single_min_triple"];
          } if (parseFloat(newValue[1]) < 10 && parseFloat(newValue[0]) < 100) {
            return ["preview_minutes_single", "preview_line_min_single"];
          }
      }
      $scope.appliedClass = function() {
          if (parseFloat(newValue[0]) > 9 && parseFloat(newValue[0]) < 100) {
            return ["preview_hours_double", "preview_circle_double"];
          } if (parseFloat(newValue[0]) < 10){
            return ["preview_hours_single", "preview_circle_single"];
          } if (parseFloat(newValue[0]) > 99) {
            return ["preview_hours_triple", "preview_circle_triple"];
          }
      }
    });

    $scope.buttonguy = function(id){
      console.log('lol !!!')
      saveSvgAsPng(document.getElementById(id), id + " Coordinate", {width: 130, height: 130});
    }

    var callCoords = function(){
      $scope.$apply(function(){
        $scope.latitudeDMS = mapService.returnLat(mapMarker.marker)[3];
        $scope.latitude = mapService.returnLat(mapMarker.marker);
        $scope.latitudeDirection =  mapService.returnLatDir(mapMarker.marker);

        $scope.longitudeDMS = mapService.returnLng(mapMarker.marker)[3];
        $scope.longitude = mapService.returnLng(mapMarker.marker);
        $scope.longitudeDirection = mapService.returnLngDir(mapMarker.marker);

        console.log($scope.latitudeDMS)
        dataService.storeToLocal('coordinates', mapService.concatonateCoordinates(mapService.returnLatDir(mapMarker.marker) + ' ' + mapService.returnLat(mapMarker.marker)[3], mapService.returnLngDir(mapMarker.marker) + ' ' + mapService.returnLng(mapMarker.marker)[3]));
      });
      
      saveDecimalDegreesToStorage();
    }

    google.maps.event.addListener(mapMarker.marker, 'dragend', function(evt){
      callCoords();
    });


    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    // Bias the SearchBox results towards current map's viewport.
    map.map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.map.getBounds());
    });

    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();

      places.forEach(function(place) {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }

      mapMarker.marker.setPosition(place.geometry.location);

      callCoords();
      
      var latLngDecimalDegrees = [mapService.returnLat(mapMarker.marker)[4], mapService.returnLng(mapMarker.marker)[4]]

      localStorage.setItem('decimalDegrees', JSON.stringify(latLngDecimalDegrees));

      if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
      } else {
          bounds.extend(place.geometry.location);
        }
      });

      map.map.fitBounds(bounds);

    });

    // Map Display Tip

    $scope.className = "map-display-tip-deactive";

    $scope.changeClass = function(){
      if ($scope.className === "map-display-tip-deactive"){
        $scope.className = "map-display-tip";
      }
      else{
        $scope.className = "map-display-tip-deactive";
      }
    };
  } else {
    console.log('The Google Maps API Failed to load. :(');
    alert('The Google Maps API Failed to load. :(');
  }




})
}());