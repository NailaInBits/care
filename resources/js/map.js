/*
Antara Khan 
Tasks 
  - Directions from point a - b (mistance matrix) x
  - Different modes of transportation x
  - Markers stored in firebase on JSON
  - Pop ups: https://developers.google.com/maps/documentation/javascript/kmllayer#overview
  - Legend on the side: https://developers.google.com/maps/documentation/javascript/adding-a-legend

BUG
  -Charging station markers still won't display x
*/

//Json fron txt file into js objects 
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) { 
            //console.log(http.responseText);
             // Typical action to be performed when the document is ready:
             //document.getElementById("demo").innerHTML = xhttp.responseText;
             var response = JSON.parse(xhttp.responseText);
             var medical = response.medical;
             
             var i;
             var output = '';

        for(i=0; i < medical.length; i++){
                output += '<li>' + medical[i].location_1.cordinates[i] + '</li>';
          }

document.getElementById('medical').innerHTML = output;
          }
      };

      xhttp.open("GET", "medical.json", true);
      xhttp.send();


      var map;
      var myLatlng = {lat: 40.7128, lng: -74.0060};
      function initMap(){ //Map initialization starts here 
        map = new google.maps.Map(document.getElementById('map'),{
        zoom:3,
        minZoom: 3,
        maxZoom:15,
        mapTypeId: 'terrain',
        center: myLatlng
        // USA center:{lat: 37.0902, lng: -95.7129}
        //NYC center:{lat: 40.7128, lng: -74.0060}
      });

      //Zooms into NYC
       var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            title: 'Click to zoom'
        });

      map.addListener('center_changed', function() {
        // 3 seconds after the center of the map has changed, pan back to the
        // marker.
        window.setTimeout(function() {
          map.panTo(marker.getPosition());
        }, 3000);
      });

      marker.addListener('click', function() {
        map.setZoom(8);
        map.setCenter(marker.getPosition());
      });

      //For direction 
      new AutocompleteDirectionsHandler(map);

      //Traffic layer
      var trafficLayer = new google.maps.TrafficLayer();
      trafficLayer.setMap(map);

      //Transit layer
      var transitLayer = new google.maps.TransitLayer();
      transitLayer.setMap(map);

      //Marker icons for: shelter, food, medical and charging stations
      var baseIcon = 'http://maps.google.com/mapfiles/kml/pal2/';
      var chargeIcon= 'http://maps.google.com/mapfiles/kml/pal3/';
      var medicalIcon = 'http://maps.google.com/mapfiles/kml/pal3/';
      var icons = {
          shelters: {
            icon: baseIcon + 'icon2.png'
          },
          food: {
            icon: baseIcon + 'icon54.png'
          },
          medicals: {
            icon: medicalIcon + 'icon38.png'
          },
          chargingStations: {
            icon: chargeIcon + 'icon35.png'
          }
        };

      // Array of fake markers for shelter, medical
      var shelters = [
          {
            coords:{lat:40.743266,lng:-73.995211},
            type: 'shelters',
            content:'<h7>St. Francis II </h7><h7>155 West 22 Street, New York, Manhattan, 10011</h7>'
          },
          {
            coords:{lat:40.672775,lng:-73.9258},
            type: 'shelters',
            content:'<h7>St. Mary 1534 Prospect Place Brooklyn New York</h7>'
          },
          {
            coords:{lat:40.682063,lng:-73.982167},
            type: 'shelters',
            content:'<h7>Warren Street 551 Warren Street Brooklyn Brooklyn</h7>'
          }
        ];

        var medicals = [ 
          {
            coords:{lat:40.8902,lng:-73.9523},
            type:'medicals',
            content:'<h10>Mount Sinai Hospital East 101st Street, New York, NY, USA</h10>'
          },
          {
            coords:{lat:40.7342,lng:-73.9875},
            type:'medicals',
            content:'<h10>Mount Sinai Hospital 1st avenue, 14 street </h10>'
          },
           {
            coords:{lat:40.7346,lng:-73.9875},
            type:'medicals',
            content:'<h10>Hospital 3</h10>'
          }
      ];

       var food = [ 
          {
            coords:{lat:40.682063,lng:-73.982167},
            type:'food',
            content:'<h10>Food 1</h10>'
          },
          {
            coords:{lat:40.7148,lng:-74.0432},
             type:'food',
            content:'<h10>Food 2</h10>'
          },
          {
            coords:{lat:40.682070,lng:-73.982167},
            type:'food',
            content:'<h10>Food 3</h10>'
          }
      ];

      var chargingStations = [ 
        {
          coords:{lat:40.79004,lng:-73.353868},
          type:'chargingStations',
          content:'<h10>Charging Station 1</h10>'
        },
        {
          coords:{lat:40.7342,lng:-73.9875},
          type:'chargingStations',
          content:'<h10>Charging Station 2</h10>'
        },
        {
          coords:{lat:40.7342,lng:-73.9867},
          type:'chargingStations',
          content:'<h10>Charging Station 3 </h10>'
        },
        {
          coords:{lat:40.672775,lng:-73.9258},
          type:'chargingStations',
          content:'<h10>Charging Station 4 </h10>'
        }
      ];

      // Loop through shelter markers 
      for(var i = 0; i < shelters.length;i++){
        // Add marker
        addMarker(shelters[i]);
      }
      // Loop through medical markers 
      for (var i = 0; i < medicals.length; i++){
        addMarker(medicals[i]);
      }
       // Loop through food markers 
      for (var i = 0; i < food.length; i++){
        addMarker(food[i]);
      }
      
       // Loop through charging stations markers 
      for (var i = 0; i < chargingStations.length; i++){
        addMarker(chargingStations[i]);
      }

      // Add Marker Function
      //Takes the cordinates and adds the icons to it 
      function addMarker(props){
        var marker = new google.maps.Marker({
          position:props.coords,
          icon: icons[props.type].icon,
          map:map,
        });


      // Listen for click on map
      google.maps.event.addListener(map, 'click', function(event){
        // Add marker
        addMarker({coords:event.latLng});
      });

        // Check for customicon
        if(props.iconImage){
          // Set icon image
          marker.setIcon(props.iconImage);
        }
        // Dialog pop up with address 
        if(props.content){
          var infoWindow = new google.maps.InfoWindow({
            content:props.content
          });
          marker.addListener('click', function(){
            infoWindow.open(map, marker);
          });
        }
      }

  map.data.setStyle(styleFeature);

        // Get the earthquake data (JSONP format)
        // This feed is a copy from the USGS feed, you can find the originals here:
        //   http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
        var script = document.createElement('script');
        script.setAttribute(
            'src',
            'https://storage.googleapis.com/mapsdevsite/json/quakes.geo.json');
        document.getElementsByTagName('head')[0].appendChild(script);

  } // Closes init map()

  