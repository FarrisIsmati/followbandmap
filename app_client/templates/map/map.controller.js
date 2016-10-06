'use strict';

(function() {

var app = angular.module("map.controller", []);

app.controller('map.controller', function($scope, $location, mapService, dataService){
  var mapService = mapService;
  var dataService = dataService;

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
    
    $scope.longitudeDirection = mapService.returnLngDir(mapMarker.marker);
    $scope.longitudeDMS = mapService.returnLng(mapMarker.marker)[3];

    var callCoords = function(){
      $scope.$apply(function(){
        $scope.latitudeDMS = mapService.returnLat(mapMarker.marker)[3];
        $scope.latitudeDirection =  mapService.returnLatDir(mapMarker.marker);

        $scope.longitudeDMS = mapService.returnLng(mapMarker.marker)[3];
        $scope.longitudeDirection = mapService.returnLngDir(mapMarker.marker);

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
    $location.path('/shop');
  }


})
}());