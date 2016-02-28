// Put your zillow.com API key here
var zwsid = "X1-ZWz1f6cqbjwv7v_6msnx";

var request = new XMLHttpRequest();
var map;
var geocoder;
var marker;
var address;
var city;
var state;
var zipcode;

function initialize () 
{
    map = new google.maps.Map(document.getElementById('map'),
        {
            center : new google.maps.LatLng(32.75, -97.13),
            scrollwheel : false,
            zoom : 17,
            mapTypeId : google.maps.MapTypeId.ROADMAP
        });

    marker = new google.maps.Marker(
        {
            position : map.center,
            map : map
        });

    geocoder = new google.maps.Geocoder();    
    initMap();
}

function initMap()
{
    google.maps.event.addListener(map, 'click', function(event)
    {
        geocoder = new google.maps.Geocoder();
        geocoder.geocode({'latLng' : event.latLng}, function(results, status)
        {
            //request.onreadystatechange = 
            if (request.readyState == 4) 
            {
                var xml = request.responseXML.documentElement;
                var value = xml.getElementsByTagName("zestimate")[0].getElementsByTagName("amount")[0].innerHTML;
                document.getElementById("output").innerHTML += "<br/>" + results[0].formatted_address + " : " + "$" + value;
                //codeAddress(address, city, state, zipcode);
                    
                if(status === google.maps.GeocoderStatus.OK && results[1])
                {
                    var temp = results[1].formatted_address.split(',');
                    address = temp[0];
                    city = temp[1];
                    var temp2 = temp[2].split(" ");
                    //console.log(temp[2]);
                    state = temp2[0];
                    zipcode = temp2[1];
                    map.setCenter(results[1].geometry.location);
                    marker.setPosition(results[1].geometry.location);
                    marker.setMap(map);
                    marker.setAnimation(google.maps.Animation.DROP);
                    //console.log(results[0]);
                }
            }

        request.open("GET","proxy.php?zws-id="+zwsid+"&address="+address+"&citystatezip="+city+"+"+state+"+"+zipcode);
        request.withCredentials = "true";
        request.send(null);
        zipcode = null;
        });

    });
}

function codeAddress(address, city, state, zipcode)
{
    geocoder = new google.maps.Geocoder();
    var add = address + ", " + city + ", " + state + ", " + zipcode;
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
}


function displayResult () {
    if (request.readyState == 4 && zipcode) {
        var xml = request.responseXML.documentElement;
        var value = xml.getElementsByTagName("zestimate")[0].getElementsByTagName("amount")[0].innerHTML;
	    document.getElementById("output").innerHTML += "<br/>" + address + ", " + city + ", " + state + ", " + zipcode + " : " + "$" + value;
        codeAddress(address, city, state, zipcode);
    }
}

function sendRequest () {
    address = document.getElementById("address").value;
    city = document.getElementById("city").value;
    state = document.getElementById("state").value;
    zipcode = document.getElementById("zipcode").value;
    request.onreadystatechange = displayResult;
    request.open("GET","proxy.php?zws-id="+zwsid+"&address="+address+"&citystatezip="+city+"+"+state+"+"+zipcode);
    request.withCredentials = "true";
    request.send(null);
}