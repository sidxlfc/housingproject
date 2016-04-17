// Put your zillow.com API key here
var zwsid = "X1-ZWz1f6cqbjwv7v_6msnx";

var request = new XMLHttpRequest();
var map;
var address;

function initialize () 
{
    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 32.75, lng: -97.13},
    scrollwheel: false,
    zoom: 17
  });

    marker = new google.maps.Marker(
        {
            position : map.center,
            map : map
        });
    
    geocoder = new google.maps.Geocoder();

    google.maps.event.addListener(map, 'click', function(event) {
            getAddress(event.latLng);
        });
}

function getAddress(latLng) 
{
    var a;
    geocoder.geocode( {'latLng': latLng},
      function(results, status) {
        if(status == google.maps.GeocoderStatus.OK) {
          if(results[0]) 
          {
            document.getElementById("address").value = results[0].formatted_address;
            sendRequest();
          }
      }
    });
}

function displayResult () 
{
    if (request.readyState == 4) 
    {
        var xml = request.responseXML.documentElement;
        var value = xml.getElementsByTagName("zestimate")[0].getElementsByTagName("amount")[0].innerHTML;
        document.getElementById("output").innerHTML += address + " : $" + value + "<br/>";
    }
}

function sendRequest () 
{
    address = document.getElementById("address").value;
    
    var add = address.split(",");
    var place = add[0];
    var city = add[1];
    //console.log(add[2]);
    var sz = add[2].split(" ");
    //console.log(sz);
    var state = sz[1];
    var zipcode = sz[2];
    //document.getElementById("output").innerHTML = address + city + state + zipcode;

    //geocoder = new google.maps.Geocoder();
    add = place + ", " + city + ", " + state + ", " + zipcode;
    geocoder.geocode( { 'address' : add}, function(results, status) {
          //console.log(results[0]);
        if (status == google.maps.GeocoderStatus.OK && results[0]) {
            //console.log(results[0]);
            map.setCenter(results[0].geometry.location);
            marker.setPosition(results[0].geometry.location);
            marker.setMap(map);
            marker.setAnimation(google.maps.Animation.DROP);
        }
    });

    request.open("GET","proxy.php?zws-id="+zwsid+"&address="+place+"&citystatezip="+city+"+"+state+"+"+zipcode);
    request.withCredentials = "true";
    request.onreadystatechange = displayResult;
    request.send(null);
}